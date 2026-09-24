'use strict';

const CONFIG = {
  slideMs: 25000,          // tempo de cada paisagem na tela
  fadeMs: 3000,            // precisa bater com a transição de .slide no CSS
  idleMs: 3000,            // esconde os controles após esse tempo parado
  volume: 0.7,
  photoCategory: 'Category:Featured_pictures_of_landscapes',
  // Itens do Internet Archive com licença Creative Commons / domínio público
  musicItems: [
    'chillhop-raw-cuts',                       // Chillhop Music — CC BY-NC-ND 4.0
    'loyalty-freak-music-lofi-ambient-songs',  // Loyalty Freak Music — CC0
    'lofi-lion-tame-the-beast',                // CC BY 4.0
    'cozy-alone-lofi-chill-out-beats',         // CC BY-NC 4.0
  ],
};

const $ = (sel) => document.querySelector(sel);
const body = document.body;
const audio = $('#audio');
const slides = [$('#slideA'), $('#slideB')];

const state = {
  started: false,
  paused: false,
  photos: [],
  photoIndex: 0,
  front: 0,          // índice do slide visível
  elapsed: 0,
  lastTick: 0,
  nextReady: null,   // Promise da próxima foto pré-carregada
  transitioning: false,
  tracks: [],
  trackIndex: 0,
  wakeLock: null,
};

// ---------- utilidades ----------

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function stripHtml(html) {
  const el = document.createElement('div');
  el.innerHTML = html || '';
  return el.textContent.trim().replace(/\s+/g, ' ');
}

const rand = (min, max) => min + Math.random() * (max - min);

function storage(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch { /* storage indisponível */ }
  return null;
}

// ---------- fotos (Wikimedia Commons) ----------

async function loadPhotos() {
  const width = window.screen.width * (window.devicePixelRatio || 1) > 2560 ? 3840 : 2560;
  const base = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query',
    generator: 'categorymembers',
    gcmtitle: CONFIG.photoCategory,
    gcmtype: 'file',
    gcmlimit: '500',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiextmetadatafilter: 'Artist|LicenseShortName',
    iiurlwidth: String(width),
    format: 'json',
    origin: '*',
  });

  const fetchPage = async (cont) => {
    const data = await (await fetch(base + '&' + new URLSearchParams(cont || {}))).json();
    const photos = [];
    for (const p of Object.values(data.query?.pages || {})) {
      const info = p.imageinfo?.[0];
      if (!info?.thumburl) continue;
      const ratio = info.width / info.height;
      // só paisagem "de verdade": horizontal, sem panoramas extremos, alta resolução
      if (ratio < 1.3 || ratio > 2.2 || info.width < 3000) continue;
      photos.push({
        url: info.thumburl,
        page: info.descriptionurl,
        title: p.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' '),
        artist: stripHtml(info.extmetadata?.Artist?.value) || 'Autor desconhecido',
        license: info.extmetadata?.LicenseShortName?.value || '',
      });
    }
    return { photos: shuffle(photos), cont: data.continue };
  };

  // A primeira página já basta para começar; o resto chega em segundo plano
  let { photos, cont } = await fetchPage();
  state.photos = photos;
  (async () => {
    while (cont) {
      const next = await fetchPage(cont);
      state.photos.push(...next.photos);
      cont = next.cont;
    }
  })().catch(() => { /* segue com o que já tem */ });
}

function preload(photo) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => resolve(photo));
    img.onerror = reject;
    img.src = photo.url;
  });
}

// Tenta até achar uma foto que carregue
async function preloadNext() {
  for (let tries = 0; tries < 5; tries++) {
    state.photoIndex = (state.photoIndex + 1) % state.photos.length;
    try {
      return await preload(state.photos[state.photoIndex]);
    } catch { /* pula a foto quebrada */ }
  }
  return null;
}

function kenBurns(img) {
  img.getAnimations().forEach((a) => a.cancel());
  const zoomIn = Math.random() > 0.35;
  const small = rand(1.02, 1.06);
  const big = rand(1.14, 1.22);
  const dx = rand(-3, 3), dy = rand(-2.5, 2.5);
  const from = `scale(${zoomIn ? small : big}) translate(${zoomIn ? 0 : dx}%, ${zoomIn ? 0 : dy}%)`;
  const to = `scale(${zoomIn ? big : small}) translate(${zoomIn ? dx : 0}%, ${zoomIn ? dy : 0}%)`;
  const anim = img.animate([{ transform: from }, { transform: to }], {
    duration: CONFIG.slideMs + CONFIG.fadeMs * 2,
    easing: 'linear',
    fill: 'forwards',
  });
  if (state.paused) anim.pause();
}

function showPhoto(photo) {
  const nextIdx = 1 - state.front;
  const incoming = slides[nextIdx];
  const img = incoming.querySelector('img');
  img.src = photo.url;
  kenBurns(img);
  incoming.classList.add('visible');
  slides[state.front].classList.remove('visible');
  state.front = nextIdx;

  const credit = $('#photoCredit');
  credit.textContent = '';
  const link = document.createElement('a');
  link.href = photo.page;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = photo.title;
  credit.append('📷 ', link, ` — ${photo.artist}${photo.license ? ` (${photo.license})` : ''}`);
}

async function advance() {
  if (state.transitioning) return;
  state.transitioning = true;
  const photo = await state.nextReady;
  if (photo) showPhoto(photo);
  state.elapsed = 0;
  state.nextReady = preloadNext();
  state.transitioning = false;
}

function tick(now) {
  if (!state.paused && state.lastTick) state.elapsed += now - state.lastTick;
  state.lastTick = now;
  if (state.elapsed >= CONFIG.slideMs) advance();
  requestAnimationFrame(tick);
}

// ---------- música (Internet Archive) ----------

async function loadTracks() {
  const results = await Promise.allSettled(CONFIG.musicItems.map(async (id) => {
    const data = await (await fetch(`https://archive.org/metadata/${id}`)).json();
    const meta = data.metadata || {};
    return (data.files || [])
      .filter((f) => /\.mp3$/i.test(f.name) && (f.source === 'original' || /VBR/.test(f.format || '')))
      .map((f) => ({
        url: `https://archive.org/download/${id}/${encodeURIComponent(f.name)}`,
        title: f.title || f.name.replace(/\.mp3$/i, ''),
        artist: f.artist || f.creator || meta.creator || '',
        page: `https://archive.org/details/${id}`,
      }));
  }));
  state.tracks = shuffle(results.flatMap((r) => (r.status === 'fulfilled' ? r.value : [])));
}

function playTrack(index) {
  if (!state.tracks.length) return;
  state.trackIndex = (index + state.tracks.length) % state.tracks.length;
  const track = state.tracks[state.trackIndex];
  audio.src = track.url;
  audio.volume = 0;
  if (!state.paused) audio.play().then(fadeInAudio).catch(() => {});

  const credit = $('#trackCredit');
  credit.textContent = '';
  const link = document.createElement('a');
  link.href = track.page;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = track.title;
  credit.append('♪ ', link, track.artist ? ` — ${track.artist}` : '');
}

function fadeInAudio() {
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / 2500);
    audio.volume = CONFIG.volume * t;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

audio.addEventListener('ended', () => playTrack(state.trackIndex + 1));
audio.addEventListener('error', () => setTimeout(() => playTrack(state.trackIndex + 1), 1000));

// ---------- controles ----------

function setPaused(paused) {
  state.paused = paused;
  body.classList.toggle('paused', paused);
  $('#playBtn').setAttribute('aria-label', paused ? 'Tocar' : 'Pausar');
  slides.forEach((s) => s.querySelector('img').getAnimations().forEach((a) => (paused ? a.pause() : a.play())));
  if (paused) audio.pause();
  else if (audio.src) audio.play().catch(() => {});
}

function setMuted(muted) {
  audio.muted = muted;
  body.classList.toggle('muted', muted);
  $('#muteBtn').setAttribute('aria-label', muted ? 'Desmutar' : 'Mutar');
  storage('armony:muted', muted ? '1' : '0');
}

function toggleFullscreen() {
  const el = document.documentElement;
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  } else {
    (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
  }
}

['fullscreenchange', 'webkitfullscreenchange'].forEach((evt) =>
  document.addEventListener(evt, () => {
    const fs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    body.classList.toggle('fullscreen', fs);
    $('#fsBtn').setAttribute('aria-label', fs ? 'Sair da tela cheia' : 'Tela cheia');
  })
);

$('#playBtn').addEventListener('click', () => setPaused(!state.paused));
$('#muteBtn').addEventListener('click', () => setMuted(!audio.muted));
$('#fsBtn').addEventListener('click', toggleFullscreen);

document.addEventListener('keydown', (e) => {
  if (!state.started) return;
  if (e.code === 'Space') { e.preventDefault(); setPaused(!state.paused); }
  else if (e.key === 'm' || e.key === 'M') setMuted(!audio.muted);
  else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
  else if (e.key === 'ArrowRight') advance();
  else if (e.key === 'n' || e.key === 'N') playTrack(state.trackIndex + 1);
});

// Esconde controles e cursor quando o mouse fica parado
let idleTimer;
function wake() {
  body.classList.remove('idle');
  clearTimeout(idleTimer);
  if (state.started) idleTimer = setTimeout(() => body.classList.add('idle'), CONFIG.idleMs);
}
['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach((evt) =>
  document.addEventListener(evt, wake, { passive: true })
);

// Mantém a tela ligada (é um quadro, afinal)
async function keepAwake() {
  try { state.wakeLock = await navigator.wakeLock?.request('screen'); } catch { /* sem suporte */ }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && state.started) keepAwake();
});

// ---------- início ----------

const photosLoading = loadPhotos().catch(() => {});
const tracksLoading = loadTracks().catch(() => {});

$('#startBtn').addEventListener('click', async () => {
  if (state.started) return;
  state.started = true;
  $('#startBtn .hint').textContent = 'carregando…';
  setMuted(storage('armony:muted') === '1');
  keepAwake();

  // Começa a música ainda dentro do clique, para o navegador liberar o autoplay
  if (state.tracks.length) playTrack(0);
  else tracksLoading.then(() => playTrack(0));

  await photosLoading;
  if (!state.photos.length) {
    $('#startBtn .hint').textContent = 'não foi possível carregar as fotos';
    return;
  }
  state.photoIndex = -1;
  const first = await preloadNext();
  if (first) showPhoto(first);
  state.nextReady = preloadNext();
  $('#start').classList.add('gone');
  wake();
  requestAnimationFrame(tick);
});
