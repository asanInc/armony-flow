'use strict';

const CONFIG = {
  slideMs: 25000,          // how long each photo stays on screen
  fadeMs: 3000,            // must match the .slide transition in style.css
  idleMs: 3000,            // hide the controls after this long without input
  volume: 0.7,
};

// ---------- languages ----------

const I18N = {
  pt: {
    tapToStart: 'toque para começar',
    loading: 'carregando…',
    photoError: 'não foi possível carregar as fotos',
    loadingTracks: 'carregando músicas…',
    unknownAuthor: 'Autor desconhecido',
    prev: 'Música anterior',
    next: 'Próxima música',
    play: 'Tocar',
    pause: 'Pausar',
    mute: 'Mutar',
    unmute: 'Desmutar',
    fullscreen: 'Tela cheia',
    exitFullscreen: 'Sair da tela cheia',
    panel: 'Playlist e estilos',
    settings: 'Ajustes',
    close: 'Fechar',
    photos: 'Fotos',
    music: 'Música',
    language: 'Idioma',
    playlist: 'Playlist',
    Space: 'espaço',
  },
  en: {
    tapToStart: 'tap to begin',
    loading: 'loading…',
    photoError: "couldn't load the photos",
    loadingTracks: 'loading music…',
    unknownAuthor: 'Unknown author',
    prev: 'Previous track',
    next: 'Next track',
    play: 'Play',
    pause: 'Pause',
    mute: 'Mute',
    unmute: 'Unmute',
    fullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
    panel: 'Playlist and styles',
    settings: 'Settings',
    close: 'Close',
    photos: 'Photos',
    music: 'Music',
    language: 'Language',
    playlist: 'Playlist',
    Space: 'space',
  },
};

const LANGUAGES = { pt: { label: 'Português' }, en: { label: 'English' } };

// Time zones of Portuguese-speaking countries: catches people in Brazil, Portugal, etc.
// even when their browser is set to English
const PT_TIMEZONES = /^(America\/(Sao_Paulo|Fortaleza|Recife|Bahia|Belem|Maceio|Araguaina|Manaus|Cuiaba|Campo_Grande|Porto_Velho|Boa_Vista|Rio_Branco|Eirunepe|Santarem|Noronha)|Europe\/Lisbon|Atlantic\/(Madeira|Azores|Cape_Verde)|Africa\/(Luanda|Maputo|Bissau|Sao_Tome)|Asia\/(Dili|Macau))$/;

function detectLang() {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
  if (langs.some((l) => /^pt\b/i.test(l))) return 'pt';
  try {
    if (PT_TIMEZONES.test(Intl.DateTimeFormat().resolvedOptions().timeZone)) return 'pt';
  } catch { /* no Intl support */ }
  return 'en';
}

let lang = 'en';
const t = (key) => I18N[lang][key] ?? key;
const label = (item) => item.label[lang] ?? item.label;

// Wikimedia Commons "Featured pictures of …" categories
const PHOTO_STYLES = {
  landscapes: { label: { pt: 'Paisagens', en: 'Landscapes' }, categories: ['landscapes'] },
  mountains: { label: { pt: 'Montanhas', en: 'Mountains' }, categories: ['mountains', 'volcanoes'] },
  water: { label: { pt: 'Água', en: 'Water' }, categories: ['coasts', 'beaches', 'lakes', 'waterfalls', 'bodies_of_water', 'islands'] },
  forests: { label: { pt: 'Florestas', en: 'Forests' }, categories: ['forests', 'parks', 'gardens'] },
  countryside: { label: { pt: 'Campo', en: 'Countryside' }, categories: ['agriculture'] },
  cities: { label: { pt: 'Cidades', en: 'Cities' }, categories: ['cityscapes'] },
  everything: { label: { pt: 'Tudo', en: 'Everything' }, categories: ['landscapes', 'mountains', 'coasts', 'beaches', 'lakes', 'waterfalls', 'forests', 'agriculture', 'cityscapes'] },
};

// Internet Archive items licensed under Creative Commons or in the public domain
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
  classical: {
    label: { pt: 'Clássica', en: 'Classical' },
    items: [
      'musopen-chopin',  // Musopen — Chopin's complete works — CC0
      'Musopen-Libre',   // Musopen — symphonies — CC BY-SA 3.0
    ],
  },
  nature: {
    label: { pt: 'Natureza', en: 'Nature' },
    items: [
      'relaxingrainsounds',          // rain — CC0
      'ocean-sea-sounds',            // ocean — CC0
      'naturesounds-soundtheraphy',  // birds, water — CC0
    ],
  },
};

// Empty WAV, played inside the start tap so Safari unlocks audio playback
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

const $ = (sel) => document.querySelector(sel);
const body = document.body;
const audio = $('#audio');
const slides = [$('#slideA'), $('#slideB')];

const state = {
  started: false,
  paused: false,
  photoStyle: 'landscapes',
  photos: [],
  photoIndex: -1,
  currentPhoto: null,
  front: 0,          // index of the visible slide
  elapsed: 0,
  lastTick: 0,
  nextReady: null,   // Promise for the preloaded next photo
  transitioning: false,
  musicStyle: 'lofi',
  tracks: [],
  trackIndex: 0,
  wakeLock: null,
};

// ---------- utilities ----------

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
  } catch { /* storage unavailable */ }
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

// ---------- photos (Wikimedia Commons) ----------

// Wikimedia only serves fixed thumbnail sizes (1920, 3840…). Screens wider than 1920
// physical pixels, like the iPad's, get 3840 so photos stay sharp while zoomed.
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
    // true landscape orientation, no extreme panoramas, high resolution only
    if (ratio < 1.3 || ratio > 2.2 || info.width < 3000) continue;
    photos.push({
      url: info.thumburl,
      page: info.descriptionurl,
      title: p.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' '),
      artist: stripHtml(info.extmetadata?.Artist?.value),
      license: info.extmetadata?.LicenseShortName?.value || '',
    });
  }
  return { photos, cont: data.continue };
}

// Each style has a list that grows as its categories load. The Promise resolves as soon
// as the first page arrives; the rest is shuffled in ahead of the current photo.
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

// Returns the decoded <img> itself: that exact element goes on screen, so the
// browser never has to decode a JPEG in the middle of a crossfade.
async function preload(photo) {
  const img = new Image();
  img.decoding = 'async';
  img.alt = '';
  img.src = photo.url;
  await img.decode();
  return { photo, img };
}

// Keep trying until a photo loads
async function preloadNext() {
  const photos = state.photos;
  for (let tries = 0; tries < 5 && photos.length; tries++) {
    state.photoIndex = (state.photoIndex + 1) % photos.length;
    try {
      return await preload(photos[state.photoIndex]);
    } catch { /* skip the broken photo */ }
  }
  return null;
}

function kenBurns(img) {
  img.getAnimations().forEach((a) => a.cancel());
  const zoomIn = Math.random() > 0.35;
  const small = rand(1.02, 1.06);
  const big = rand(1.14, 1.22);
  const dx = rand(-3, 3), dy = rand(-2.5, 2.5);
  // rotate(0.01deg) is invisible, but it stops Firefox from snapping the layer to whole
  // pixels; without it, motion this slow moves in visible 1px jumps.
  const from = `translate3d(${zoomIn ? 0 : dx}%, ${zoomIn ? 0 : dy}%, 0) scale(${zoomIn ? small : big}) rotate(0.01deg)`;
  const to = `translate3d(${zoomIn ? dx : 0}%, ${zoomIn ? dy : 0}%, 0) scale(${zoomIn ? big : small}) rotate(0.01deg)`;
  const anim = img.animate([{ transform: from }, { transform: to }], {
    // extra slack: if the next photo is slow to download, keep moving instead of freezing
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
  // wait one frame so the image is painted before the fade starts
  requestAnimationFrame(() => {
    incoming.classList.add('visible');
    outgoing.classList.remove('visible');
  });

  state.currentPhoto = photo;
  renderPhotoCredit();
}

function renderPhotoCredit() {
  const photo = state.currentPhoto;
  if (!photo) return;
  $('#photoCredit').replaceChildren('📷 ', creditLink(photo.title, photo.page),
    ` — ${photo.artist || t('unknownAuthor')}${photo.license ? ` (${photo.license})` : ''}`);
}

async function advance() {
  if (state.transitioning || !state.nextReady) return;
  state.transitioning = true;
  const pending = state.nextReady;
  const next = await pending;
  state.transitioning = false;
  // the style changed while waiting: drop this one, the next tick retries with the new list
  if (pending !== state.nextReady) return;
  if (next) showPhoto(next);
  state.elapsed = 0;
  state.nextReady = preloadNext();
}

function tick(now) {
  // cap the jump when the tab comes back from the background
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
  // force a switch on the next frame, with the usual crossfade
  if (state.started) state.elapsed = CONFIG.slideMs;
}

// ---------- music (Internet Archive) ----------

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
      album: `Armony Flow · ${label(MUSIC_STYLES[state.musicStyle])}`,
    });
  }
}

// Back: within the first seconds go to the previous track, otherwise restart the current one
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

// 'ended' and 'error' can fire together: the token makes sure only one of them skips ahead
audio.addEventListener('ended', () => !playingSilence() && nextTrack());
audio.addEventListener('error', () => {
  if (!audio.error || playingSilence()) return;
  const token = trackToken;
  clearTimeout(skipTimer);
  skipTimer = setTimeout(() => token === trackToken && nextTrack(), 1000);
});

// Only one instance plays at a time: opening the app in another tab or window pauses the rest
const instanceId = Math.random().toString(36).slice(2);
const channel = 'BroadcastChannel' in window ? new BroadcastChannel('armony-flow') : null;
audio.addEventListener('play', () => !playingSilence() && channel?.postMessage({ playing: instanceId }));
if (channel) {
  channel.onmessage = (e) => {
    if (e.data?.playing && e.data.playing !== instanceId && !state.paused) setPaused(true);
  };
}
window.addEventListener('pagehide', () => audio.pause());

// Media keys, Bluetooth headphones and the iPad lock screen
if ('mediaSession' in navigator) {
  const handlers = {
    play: () => setPaused(false),
    pause: () => setPaused(true),
    previoustrack: prevTrack,
    nexttrack: nextTrack,
  };
  for (const [action, fn] of Object.entries(handlers)) {
    try { navigator.mediaSession.setActionHandler(action, fn); } catch { /* action not supported */ }
  }
}

// ---------- playlist panel ----------

function renderChips() {
  const build = (container, styles, current, onPick) => {
    container.replaceChildren(...Object.entries(styles).map(([key, item]) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = label(item);
      chip.setAttribute('aria-pressed', String(key === current));
      chip.addEventListener('click', () => key !== current && onPick(key));
      return chip;
    }));
  };
  build($('#photoChips'), PHOTO_STYLES, state.photoStyle, setPhotoStyle);
  build($('#musicChips'), MUSIC_STYLES, state.musicStyle, setMusicStyle);
  build($('#langChips'), LANGUAGES, lang, setLang);
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
    li.textContent = t('loadingTracks');
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

// ---------- on-screen text ----------

// Buttons keep their text key in data-i18n-label; the title also shows the keyboard shortcut
function setButtonLabel(el, key) {
  el.dataset.i18nLabel = key;
  const text = t(key);
  el.setAttribute('aria-label', text);
  if (el.dataset.key) el.title = `${text} (${t(el.dataset.key)})`;
}

function setHint(key) {
  const hint = $('#startBtn .hint');
  hint.dataset.i18n = key;
  hint.textContent = t(key);
}

function applyI18n() {
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll('[data-i18n-label]').forEach((el) => setButtonLabel(el, el.dataset.i18nLabel));
  renderChips();
  renderPlaylist();
  renderPhotoCredit();
}

function setLang(next) {
  lang = next;
  storage('armony:lang', next);
  applyI18n();
}

// ---------- controls ----------

function setPaused(paused) {
  state.paused = paused;
  body.classList.toggle('paused', paused);
  setButtonLabel($('#playBtn'), paused ? 'play' : 'pause');
  slides.forEach((s) => s.querySelector('img')?.getAnimations().forEach((a) => (paused ? a.pause() : a.play())));
  if (paused) audio.pause();
  else if (audio.src && !playingSilence()) audio.play().catch(() => {});
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = paused ? 'paused' : 'playing';
}

function setMuted(muted) {
  audio.muted = muted;
  body.classList.toggle('muted', muted);
  setButtonLabel($('#muteBtn'), muted ? 'unmute' : 'mute');
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

// iPhone and Home Screen mode have no Fullscreen API (and don't need one)
const docEl = document.documentElement;
if (!(docEl.requestFullscreen || docEl.webkitRequestFullscreen)) body.classList.add('no-fullscreen');

['fullscreenchange', 'webkitfullscreenchange'].forEach((evt) =>
  document.addEventListener(evt, () => {
    const fs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    body.classList.toggle('fullscreen', fs);
    setButtonLabel($('#fsBtn'), fs ? 'exitFullscreen' : 'fullscreen');
  })
);

$('#prevBtn').addEventListener('click', prevTrack);
$('#playBtn').addEventListener('click', () => setPaused(!state.paused));
$('#nextBtn').addEventListener('click', nextTrack);
$('#muteBtn').addEventListener('click', () => setMuted(!audio.muted));
$('#listBtn').addEventListener('click', () => setPanel(!panelOpen()));
$('#closePanel').addEventListener('click', () => setPanel(false));
$('#fsBtn').addEventListener('click', toggleFullscreen);

// Clicking outside the panel closes it
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

// Hide the controls and cursor when the mouse is still (unless the panel is open)
let idleTimer;
function wake() {
  body.classList.remove('idle');
  clearTimeout(idleTimer);
  if (state.started && !panelOpen()) idleTimer = setTimeout(() => body.classList.add('idle'), CONFIG.idleMs);
}
['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach((evt) =>
  document.addEventListener(evt, wake, { passive: true })
);

// Keep the screen awake (it's a picture frame, after all)
async function keepAwake() {
  try { state.wakeLock = await navigator.wakeLock?.request('screen'); } catch { /* not supported */ }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && state.started) keepAwake();
});

// ---------- startup ----------

const savedLang = storage('armony:lang');
lang = savedLang in I18N ? savedLang : detectLang();
const savedPhoto = storage('armony:photoStyle');
const savedMusic = storage('armony:musicStyle');
if (savedPhoto in PHOTO_STYLES) state.photoStyle = savedPhoto;
if (savedMusic in MUSIC_STYLES) state.musicStyle = savedMusic;
applyI18n();

// start downloading while the start screen is still showing
const photosLoading = loadPhotoStyle(state.photoStyle);
setMusicStyle(state.musicStyle);

$('#startBtn').addEventListener('click', async () => {
  if (state.started) return;
  state.started = true;
  setHint('loading');
  setMuted(storage('armony:muted') === '1');
  keepAwake();

  // Play something inside the tap itself so the browser allows autoplay (Safari/iOS).
  // If the tracks haven't arrived yet, setMusicStyle starts playback when they do.
  if (state.tracks.length) playTrack(0);
  else {
    audio.src = SILENCE;
    audio.play().catch(() => {});
  }

  state.photos = await photosLoading;
  if (!state.photos.length) {
    setHint('photoError');
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
