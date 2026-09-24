'use strict';

const CONFIG = {
  slideMs: 25000,          // tempo de cada foto na tela
  fadeMs: 3000,            // precisa bater com a transição de .slide no CSS
  idleMs: 3000,            // esconde os controles após esse tempo parado
  volume: 0.7,
};

// Categorias "Featured pictures of …" do Wikimedia Commons
const PHOTO_STYLES = {
  paisagens: { label: 'Paisagens', categories: ['landscapes'] },
  montanhas: { label: 'Montanhas', categories: ['mountains', 'volcanoes'] },
  agua: { label: 'Água', categories: ['coasts', 'beaches', 'lakes', 'waterfalls', 'bodies_of_water', 'islands'] },
  florestas: { label: 'Florestas', categories: ['forests', 'parks', 'gardens'] },
  campo: { label: 'Campo', categories: ['agriculture'] },
  cidades: { label: 'Cidades', categories: ['cityscapes'] },
  tudo: { label: 'Tudo', categories: ['landscapes', 'mountains', 'coasts', 'beaches', 'lakes', 'waterfalls', 'forests', 'agriculture', 'cityscapes'] },
};

// Itens do Internet Archive com licença Creative Commons ou domínio público
const MUSIC_STYLES = {
  lofi: {
    label: 'Lofi',
    items: [
      'chillhop-raw-cuts',                       // Chillhop Music — CC BY-NC-ND 4.0
      'loyalty-freak-music-lofi-ambient-songs',  // Loyalty Freak Music — CC0
      'lofi-lion-tame-the-beast',                // CC BY 4.0
      'cozy-alone-lofi-chill-out-beats',         // CC BY-NC 4.0
    ],
  },
  jazz: {
    label: 'Jazz',
    items: [
      'DWK123',  // ProleteR — Curses From Past Times — CC BY-NC-ND 3.0
      'DWK127',  // Kova — Cookin' Session — CC BY-NC-ND 3.0
      'DWK217',  // Boogie Belgique — Nightwalker Vol. 1 — CC BY-NC-ND 3.0
    ],
  },
  piano: {
    label: 'Piano',
    items: [
      'ca315_fp',                                // Fabrizio Paterlini — Viandanze — CC BY-NC-ND 3.0
      'WM056',                                   // Lee Rosevere — Play 2 — CC BY-NC-SA 2.5
      'Vkrsnl037CandlegravityAMomentForMyself',  // Candlegravity — CC BY-NC-ND 3.0
      'pcr089EmilDavydov-Sketches',              // Emil Davydov — CC BY-ND 3.0
      'MLD_019_Abigail_Press_Drifting_Dawn',     // Abigail Press — CC BY-NC-ND 3.0
    ],
  },
  classica: {
    label: 'Clássica',
    items: [
      'musopen-chopin',  // Musopen — Chopin completo — CC0
      'Musopen-Libre',   // Musopen — sinfonias — CC BY-SA 3.0
    ],
  },
  natureza: {
    label: 'Natureza',
    items: [
      'relaxingrainsounds',          // chuva — CC0
      'ocean-sea-sounds',            // oceano — CC0
      'naturesounds-soundtheraphy',  // pássaros, água — CC0
    ],
  },
};

// WAV vazio: tocado dentro do clique inicial para o Safari liberar o áudio
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

const $ = (sel) => document.querySelector(sel);
const body = document.body;
const audio = $('#audio');
const slides = [$('#slideA'), $('#slideB')];

const state = {
  started: false,
  paused: false,
  photoStyle: 'paisagens',
  photos: [],
  photoIndex: -1,
  front: 0,          // índice do slide visível
  elapsed: 0,
  lastTick: 0,
  nextReady: null,   // Promise da próxima foto pré-carregada
  transitioning: false,
  musicStyle: 'lofi',
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

function creditLink(text, href) {
  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = text;
  return link;
}

// ---------- fotos (Wikimedia Commons) ----------

// O Wikimedia só serve tamanhos fixos (1920, 3840…). Telas acima de 1920px físicos,
// como a do iPad, recebem 3840 para ficarem nítidas mesmo com o zoom.
function photoWidth() {
  const longSide = Math.max(screen.width, screen.height) * (window.devicePixelRatio || 1);
  return longSide > 1920 ? 3840 : 1920;
}

async function fetchPhotoPage(category, cont) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'categorymembers',
    gcmtitle: `Category:Featured_pictures_of_${category}`,
    gcmtype: 'file',
    gcmlimit: '500',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiextmetadatafilter: 'Artist|LicenseShortName',
    iiurlwidth: String(photoWidth()),
    format: 'json',
    origin: '*',
    ...cont,
  });
  const data = await (await fetch('https://commons.wikimedia.org/w/api.php?' + params)).json();
  const photos = [];
  for (const p of Object.values(data.query?.pages || {})) {
    const info = p.imageinfo?.[0];
    if (!info?.thumburl) continue;
    const ratio = info.width / info.height;
    // só horizontais de verdade, sem panoramas extremos, em alta resolução
    if (ratio < 1.3 || ratio > 2.2 || info.width < 3000) continue;
    photos.push({
      url: info.thumburl,
      page: info.descriptionurl,
      title: p.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' '),
      artist: stripHtml(info.extmetadata?.Artist?.value) || 'Autor desconhecido',
      license: info.extmetadata?.LicenseShortName?.value || '',
    });
  }
  return { photos, cont: data.continue };
}

// Cada estilo tem uma lista que cresce enquanto as categorias chegam. A Promise resolve
// assim que a primeira página chega; o resto é embaralhado à frente da foto atual.
const photoLists = new Map();

function loadPhotoStyle(style) {
  if (photoLists.has(style)) return photoLists.get(style).ready;
  const list = [];
  const seen = new Set();
  let resolveReady;
  const ready = new Promise((r) => (resolveReady = r));
  photoLists.set(style, { list, ready });

  const add = (photos) => {
    for (const photo of photos) {
      if (seen.has(photo.url)) continue;
      seen.add(photo.url);
      const min = list === state.photos ? state.photoIndex + 1 : 0;
      list.splice(Math.floor(rand(min, list.length + 1)), 0, photo);
    }
  };

  (async () => {
    for (const category of shuffle([...PHOTO_STYLES[style].categories])) {
      let cont = {};
      do {
        try {
          const page = await fetchPhotoPage(category, cont);
          add(page.photos);
          cont = page.cont;
        } catch { cont = null; }
        if (list.length) resolveReady(list);
      } while (cont);
    }
    resolveReady(list);
  })();

  return ready;
}

// Devolve o próprio <img> já decodificado: é ele que entra na tela, então a
// transição não precisa decodificar o JPEG no meio da animação.
async function preload(photo) {
  const img = new Image();
  img.decoding = 'async';
  img.alt = '';
  img.src = photo.url;
  await img.decode();
  return { photo, img };
}

// Tenta até achar uma foto que carregue
async function preloadNext() {
  const photos = state.photos;
  for (let tries = 0; tries < 5 && photos.length; tries++) {
    state.photoIndex = (state.photoIndex + 1) % photos.length;
    try {
      return await preload(photos[state.photoIndex]);
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
  // rotate(0.01deg) é invisível, mas impede o Firefox de arredondar a camada para pixels
  // inteiros; sem isso um movimento tão lento anda "aos pulos" de 1px.
  const from = `translate3d(${zoomIn ? 0 : dx}%, ${zoomIn ? 0 : dy}%, 0) scale(${zoomIn ? small : big}) rotate(0.01deg)`;
  const to = `translate3d(${zoomIn ? dx : 0}%, ${zoomIn ? dy : 0}%, 0) scale(${zoomIn ? big : small}) rotate(0.01deg)`;
  const anim = img.animate([{ transform: from }, { transform: to }], {
    // folga extra: se a próxima foto demorar a baixar, a imagem continua se movendo em vez de parar
    duration: CONFIG.slideMs + CONFIG.fadeMs * 2 + 20000,
    easing: 'linear',
    fill: 'forwards',
  });
  if (state.paused) anim.pause();
}

function showPhoto({ photo, img }) {
  const nextIdx = 1 - state.front;
  const incoming = slides[nextIdx];
  incoming.querySelector('img')?.getAnimations().forEach((a) => a.cancel());
  incoming.replaceChildren(img);
  kenBurns(img);
  const outgoing = slides[state.front];
  state.front = nextIdx;
  // espera um frame com a imagem já pintada antes de iniciar o fade
  requestAnimationFrame(() => {
    incoming.classList.add('visible');
    outgoing.classList.remove('visible');
  });

  const credit = $('#photoCredit');
  credit.replaceChildren('📷 ', creditLink(photo.title, photo.page),
    ` — ${photo.artist}${photo.license ? ` (${photo.license})` : ''}`);
}

async function advance() {
  if (state.transitioning || !state.nextReady) return;
  state.transitioning = true;
  const pending = state.nextReady;
  const next = await pending;
  state.transitioning = false;
  // o estilo mudou enquanto esperava: descarta, o tick tenta de novo com a lista nova
  if (pending !== state.nextReady) return;
  if (next) showPhoto(next);
  state.elapsed = 0;
  state.nextReady = preloadNext();
}

function tick(now) {
  // limita o salto quando a aba volta do segundo plano
  if (!state.paused && state.lastTick) state.elapsed += Math.min(now - state.lastTick, 100);
  state.lastTick = now;
  if (state.elapsed >= CONFIG.slideMs) advance();
  requestAnimationFrame(tick);
}

async function setPhotoStyle(style) {
  state.photoStyle = style;
  storage('armony:photoStyle', style);
  renderChips();
  const list = await loadPhotoStyle(style);
  if (state.photoStyle !== style) return;
  state.photos = list;
  state.photoIndex = -1;
  state.nextReady = preloadNext();
  // força a troca no próximo frame, com o crossfade de sempre
  if (state.started) state.elapsed = CONFIG.slideMs;
}

// ---------- música (Internet Archive) ----------

const trackLists = new Map();

function loadMusicStyle(style) {
  if (!trackLists.has(style)) {
    trackLists.set(style, Promise.allSettled(MUSIC_STYLES[style].items.map(async (id) => {
      const data = await (await fetch(`https://archive.org/metadata/${id}`)).json();
      const meta = data.metadata || {};
      return (data.files || [])
        .filter((f) => /\.mp3$/i.test(f.name) && (f.source === 'original' || /VBR/.test(f.format || '')))
        .map((f) => ({
          url: `https://archive.org/download/${id}/${encodeURIComponent(f.name)}`,
          title: f.title || f.name.replace(/\.mp3$/i, '').replace(/_/g, ' '),
          artist: f.artist || f.creator || meta.creator || '',
          page: `https://archive.org/details/${id}`,
        }));
    })).then((results) => results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))));
  }
  return trackLists.get(style);
}

async function setMusicStyle(style) {
  state.musicStyle = style;
  storage('armony:musicStyle', style);
  renderChips();
  const tracks = await loadMusicStyle(style);
  if (state.musicStyle !== style) return;
  state.tracks = shuffle(tracks.slice());
  renderPlaylist();
  if (state.started) playTrack(0);
}

let trackToken = 0;
let skipTimer;

function playTrack(index) {
  if (!state.tracks.length) return;
  const token = ++trackToken;
  clearTimeout(skipTimer);
  state.trackIndex = (index + state.tracks.length) % state.tracks.length;
  const track = state.tracks[state.trackIndex];
  audio.src = track.url;
  audio.volume = 0;
  if (!state.paused) {
    audio.play().then(() => token === trackToken && fadeInAudio()).catch(() => {});
  }

  $('#trackCredit').replaceChildren('♪ ', creditLink(track.title, track.page), track.artist ? ` — ${track.artist}` : '');
  renderPlaylist();

  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: `Armony Flow · ${MUSIC_STYLES[state.musicStyle].label}`,
    });
  }
}

// Voltar: nos primeiros segundos vai para a faixa anterior; depois reinicia a atual
function prevTrack() {
  if (audio.currentTime > 3) audio.currentTime = 0;
  else playTrack(state.trackIndex - 1);
}
const nextTrack = () => playTrack(state.trackIndex + 1);

function fadeInAudio() {
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / 2500);
    audio.volume = CONFIG.volume * t;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const playingSilence = () => audio.src.startsWith('data:');

// 'ended' e 'error' podem chegar juntos: o token garante que só um deles avança a faixa
audio.addEventListener('ended', () => !playingSilence() && nextTrack());
audio.addEventListener('error', () => {
  if (!audio.error || playingSilence()) return;
  const token = trackToken;
  clearTimeout(skipTimer);
  skipTimer = setTimeout(() => token === trackToken && nextTrack(), 1000);
});

// Só uma instância toca por vez: abrir o quadro em outra aba/janela pausa as demais
const instanceId = Math.random().toString(36).slice(2);
const channel = 'BroadcastChannel' in window ? new BroadcastChannel('armony-flow') : null;
audio.addEventListener('play', () => !playingSilence() && channel?.postMessage({ playing: instanceId }));
if (channel) {
  channel.onmessage = (e) => {
    if (e.data?.playing && e.data.playing !== instanceId && !state.paused) setPaused(true);
  };
}
window.addEventListener('pagehide', () => audio.pause());

// Teclas de mídia, fones Bluetooth e a tela de bloqueio do iPad
if ('mediaSession' in navigator) {
  const handlers = {
    play: () => setPaused(false),
    pause: () => setPaused(true),
    previoustrack: prevTrack,
    nexttrack: nextTrack,
  };
  for (const [action, fn] of Object.entries(handlers)) {
    try { navigator.mediaSession.setActionHandler(action, fn); } catch { /* ação não suportada */ }
  }
}

// ---------- painel de playlist ----------

function renderChips() {
  const build = (container, styles, current, onPick) => {
    container.replaceChildren(...Object.entries(styles).map(([key, { label }]) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = label;
      chip.setAttribute('aria-pressed', String(key === current));
      chip.addEventListener('click', () => key !== current && onPick(key));
      return chip;
    }));
  };
  build($('#photoChips'), PHOTO_STYLES, state.photoStyle, setPhotoStyle);
  build($('#musicChips'), MUSIC_STYLES, state.musicStyle, setMusicStyle);
}

function renderPlaylist() {
  const list = $('#trackList');
  list.replaceChildren(...state.tracks.map((track, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    const title = document.createElement('span');
    title.className = 'track-title';
    title.textContent = track.title;
    const artist = document.createElement('span');
    artist.className = 'track-artist';
    artist.textContent = track.artist;
    btn.append(title, artist);
    if (i === state.trackIndex && state.started) {
      li.className = 'current';
      btn.setAttribute('aria-current', 'true');
    }
    btn.addEventListener('click', () => playTrack(i));
    li.append(btn);
    return li;
  }));
  if (!state.tracks.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'carregando músicas…';
    list.append(li);
  }
}

const panel = $('#panel');
const panelOpen = () => !panel.hidden;

function setPanel(open) {
  panel.hidden = !open;
  $('#listBtn').setAttribute('aria-expanded', String(open));
  if (open) $('#trackList .current')?.scrollIntoView({ block: 'center' });
  wake();
}

// ---------- controles ----------

function setPaused(paused) {
  state.paused = paused;
  body.classList.toggle('paused', paused);
  $('#playBtn').setAttribute('aria-label', paused ? 'Tocar' : 'Pausar');
  slides.forEach((s) => s.querySelector('img')?.getAnimations().forEach((a) => (paused ? a.pause() : a.play())));
  if (paused) audio.pause();
  else if (audio.src && !playingSilence()) audio.play().catch(() => {});
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = paused ? 'paused' : 'playing';
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

// iPhone e o modo "Tela de Início" não têm API de tela cheia (e nem precisam)
const docEl = document.documentElement;
if (!(docEl.requestFullscreen || docEl.webkitRequestFullscreen)) body.classList.add('no-fullscreen');

['fullscreenchange', 'webkitfullscreenchange'].forEach((evt) =>
  document.addEventListener(evt, () => {
    const fs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    body.classList.toggle('fullscreen', fs);
    $('#fsBtn').setAttribute('aria-label', fs ? 'Sair da tela cheia' : 'Tela cheia');
  })
);

$('#prevBtn').addEventListener('click', prevTrack);
$('#playBtn').addEventListener('click', () => setPaused(!state.paused));
$('#nextBtn').addEventListener('click', nextTrack);
$('#muteBtn').addEventListener('click', () => setMuted(!audio.muted));
$('#listBtn').addEventListener('click', () => setPanel(!panelOpen()));
$('#closePanel').addEventListener('click', () => setPanel(false));
$('#fsBtn').addEventListener('click', toggleFullscreen);

// Clicar fora do painel fecha
document.addEventListener('pointerdown', (e) => {
  if (panelOpen() && !panel.contains(e.target) && !$('#listBtn').contains(e.target)) setPanel(false);
});

document.addEventListener('keydown', (e) => {
  if (!state.started) return;
  if (e.key === 'Escape' && panelOpen()) setPanel(false);
  else if (e.code === 'Space' && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); setPaused(!state.paused); }
  else if (e.key === 'm' || e.key === 'M') setMuted(!audio.muted);
  else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
  else if (e.key === 'p' || e.key === 'P') setPanel(!panelOpen());
  else if (e.key === 'ArrowRight') advance();
  else if (e.key === 'n' || e.key === 'N') nextTrack();
  else if (e.key === 'b' || e.key === 'B') prevTrack();
});

// Esconde controles e cursor quando o mouse fica parado (menos com o painel aberto)
let idleTimer;
function wake() {
  body.classList.remove('idle');
  clearTimeout(idleTimer);
  if (state.started && !panelOpen()) idleTimer = setTimeout(() => body.classList.add('idle'), CONFIG.idleMs);
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

const savedPhoto = storage('armony:photoStyle');
const savedMusic = storage('armony:musicStyle');
if (savedPhoto in PHOTO_STYLES) state.photoStyle = savedPhoto;
if (savedMusic in MUSIC_STYLES) state.musicStyle = savedMusic;
renderChips();
renderPlaylist();

// já começa a baixar enquanto a tela inicial está aberta
const photosLoading = loadPhotoStyle(state.photoStyle);
setMusicStyle(state.musicStyle);

$('#startBtn').addEventListener('click', async () => {
  if (state.started) return;
  state.started = true;
  $('#startBtn .hint').textContent = 'carregando…';
  setMuted(storage('armony:muted') === '1');
  keepAwake();

  // Toca algo ainda dentro do clique para o navegador liberar o autoplay (Safari/iOS).
  // Se as músicas ainda não chegaram, setMusicStyle começa a tocar quando chegarem.
  if (state.tracks.length) playTrack(0);
  else {
    audio.src = SILENCE;
    audio.play().catch(() => {});
  }

  state.photos = await photosLoading;
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
