'use strict';

const CONFIG = {
  fadeMs: 3000,            // must match the .slide transition in style.css
  idleMs: 3000,            // hide the controls after this long without input
  volume: 0.7,             // default music volume
  slideMs: 30000,          // default time per photo
  durations: [15000, 30000, 60000, 300000],
  // sleep timer, in minutes (0 = off); on localhost there is also a 15-second one for testing
  sleepOptions: ['localhost', '127.0.0.1'].includes(location.hostname) ? [0, 0.25, 15, 30, 60] : [0, 15, 30, 60],
  sleepFadeMs: 60000,      // the last minute of the sleep timer fades everything out
  maxFavorites: 300,
  maxRecent: 30,           // photos remembered for starting offline
  clockPositions: ['left', 'center', 'right', 'middle'],
  clockSizes: ['small', 'medium', 'large'],
  mats: ['light', 'dark'],
};

// ---------- languages ----------

const I18N = {
  pt: {
    start: 'Começar',
    tagline: 'Fotos de paisagens com música ambiente',
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
    panel: 'Música, fotos e tela',
    tracks: 'faixas',
    close: 'Fechar',
    photos: 'Fotos',
    music: 'Música',
    display: 'Tela',
    language: 'Idioma',
    playlist: 'Playlist',
    volume: 'Volume da música',
    natureSounds: 'Sons da natureza',
    photoDuration: 'Tempo de cada foto',
    clock: 'Relógio',
    clockPosition: 'Posição do relógio',
    clockSize: 'Tamanho do relógio',
    sizeSmall: 'Pequeno',
    sizeMedium: 'Médio',
    sizeLarge: 'Grande',
    clockLeft: 'No alto, à esquerda',
    clockCenter: 'No alto, ao centro',
    clockRight: 'No alto, à direita',
    clockMiddle: 'No meio da tela',
    clockBelowLeft: 'Embaixo da foto, à esquerda',
    clockBelowCenter: 'Embaixo da foto, ao centro',
    clockBelowRight: 'Embaixo da foto, à direita',
    frameMode: 'Modo quadro',
    frameHelp: 'A foto fica parada dentro de um passe-partout, como um quadro na parede.',
    matColor: 'Cor do passe-partout',
    matLight: 'Claro',
    matDark: 'Escuro',
    photoStyle: 'Estilo',
    sleepTimer: 'Timer para dormir',
    sleepOff: 'Desligado',
    sleepAt: 'Desliga às {time}',
    sleepHelp: 'No último minuto, a música e a tela escurecem devagar.',
    liteMode: 'Modo leve',
    liteHelp: 'Troca o vidro desfocado por um fundo sólido. Deixa tudo mais fluido em aparelhos antigos.',
    sleepResume: 'Toque para continuar',
    favorite: 'Favoritar esta foto',
    unfavorite: 'Tirar das favoritas',
    favAdded: 'Adicionada às favoritas',
    favRemoved: 'Removida das favoritas',
    favEmpty: 'Toque no coração de uma foto para guardá-la aqui',
    cast: 'Mostrar na TV',
    castStop: 'Parar de mostrar na TV',
    castOn: 'Na TV',
    castStarted: 'Mostrando na TV',
    castEnded: 'A TV foi desconectada',
    castError: 'Não foi possível conectar à TV',
    castMirrorHelp: 'Para ver na Apple TV, abra a Central de Controle e toque em Espelhar Tela.',
    install: 'Instalar o app',
    installIosHelp: 'No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.',
    installed: 'App instalado',
    Space: 'espaço',
  },
  en: {
    start: 'Start',
    tagline: 'Landscape photos with ambient music',
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
    panel: 'Music, photos and display',
    tracks: 'tracks',
    close: 'Close',
    photos: 'Photos',
    music: 'Music',
    display: 'Display',
    language: 'Language',
    playlist: 'Playlist',
    volume: 'Music volume',
    natureSounds: 'Nature sounds',
    photoDuration: 'Time per photo',
    clock: 'Clock',
    clockPosition: 'Clock position',
    clockSize: 'Clock size',
    sizeSmall: 'Small',
    sizeMedium: 'Medium',
    sizeLarge: 'Large',
    clockLeft: 'Top left',
    clockCenter: 'Top center',
    clockRight: 'Top right',
    clockMiddle: 'Middle of the screen',
    clockBelowLeft: 'Under the photo, left',
    clockBelowCenter: 'Under the photo, center',
    clockBelowRight: 'Under the photo, right',
    frameMode: 'Frame mode',
    frameHelp: 'The photo stays still inside a mat, like a framed print on the wall.',
    matColor: 'Mat color',
    matLight: 'Light',
    matDark: 'Dark',
    photoStyle: 'Style',
    sleepTimer: 'Sleep timer',
    sleepOff: 'Off',
    sleepAt: 'Turns off at {time}',
    sleepHelp: 'Over the last minute, the music and the screen fade out slowly.',
    liteMode: 'Lite mode',
    liteHelp: 'Swaps the blurred glass for a solid background. Keeps things smooth on older devices.',
    sleepResume: 'Tap to continue',
    favorite: 'Favorite this photo',
    unfavorite: 'Remove from favorites',
    favAdded: 'Added to favorites',
    favRemoved: 'Removed from favorites',
    favEmpty: 'Tap the heart on a photo to keep it here',
    cast: 'Show on TV',
    castStop: 'Stop showing on TV',
    castOn: 'On TV',
    castStarted: 'Showing on TV',
    castEnded: 'Disconnected from the TV',
    castError: "Couldn't connect to the TV",
    castMirrorHelp: 'To watch on an Apple TV, open Control Center and tap Screen Mirroring.',
    install: 'Install the app',
    installIosHelp: 'In Safari, tap Share, then Add to Home Screen.',
    installed: 'App installed',
    Space: 'space',
  },
};

const LANGUAGES = { pt: { label: 'PT', name: 'Português' }, en: { label: 'EN', name: 'English' } };

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
const locale = () => (lang === 'pt' ? 'pt-BR' : 'en-US');

// ---------- content ----------

// Wikimedia Commons "Featured pictures of …" categories. `cover` is the Commons file
// shown on the style's card in the settings panel.
const PHOTO_STYLES = {
  auto: {
    label: { pt: 'Automático', en: 'Automatic' },
    cover: 'Brighton West Pier, England - Oct 2007.jpg',
  },
  landscapes: {
    label: { pt: 'Paisagens', en: 'Landscapes' },
    categories: ['landscapes'],
    cover: '2014 Track on Fremington Edge.jpg',
  },
  mountains: {
    label: { pt: 'Montanhas', en: 'Mountains' },
    categories: ['mountains', 'volcanoes'],
    cover: '1 lake louise pano 2019.jpg',
  },
  water: {
    label: { pt: 'Água', en: 'Water' },
    categories: ['coasts', 'beaches', 'lakes', 'waterfalls', 'bodies_of_water', 'islands'],
    cover: 'Kuang Si Falls and a turquoise water pool in Luang Prabang province Laos.jpg',
  },
  forests: {
    label: { pt: 'Florestas', en: 'Forests' },
    categories: ['forests', 'parks', 'gardens'],
    cover: 'Ansberg Blickrichtung Süden 120324.jpg',
  },
  countryside: {
    label: { pt: 'Campo', en: 'Countryside' },
    categories: ['agriculture'],
    cover: '2014.08.09.-11-Durbach--Weingut Schloss Staufenberg.jpg',
  },
  cities: {
    label: { pt: 'Cidades', en: 'Cities' },
    categories: ['cityscapes'],
    cover: '13-08-09-peak-by-RalfR-01.jpg',
  },
  favorites: {
    label: { pt: 'Favoritas', en: 'Favorites' },
  },
  everything: {
    label: { pt: 'Tudo', en: 'Everything' },
    categories: ['landscapes', 'mountains', 'coasts', 'beaches', 'lakes', 'waterfalls', 'forests', 'agriculture', 'cityscapes'],
    cover: 'Gokyo Ri summit, Gokyo Lake, Nepal, Himalayas.jpg',
  },
};

// "Automatic" follows the time of day. Hours run past 24 so the night can span midnight.
const PERIODS = [
  { from: 5, to: 10, categories: ['sunrises', 'lakes', 'forests'] },
  { from: 10, to: 17, categories: ['landscapes', 'mountains', 'coasts', 'beaches', 'agriculture', 'waterfalls'] },
  { from: 17, to: 20, categories: ['sunsets', 'coasts', 'clouds'] },
  // Commons has few featured night landscapes, so dusk fills in; "astronomy" is avoided
  // because it mixes in historical star charts
  { from: 20, to: 29, categories: ['aurora', 'the_Milky_Way', 'sunsets'] },
];

function periodIndex(date = new Date()) {
  const hour = date.getHours() < 5 ? date.getHours() + 24 : date.getHours();
  return PERIODS.findIndex((p) => hour >= p.from && hour < p.to);
}

const coverUrl = (file) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=500`;

// Commons thumbnails come in fixed sizes; swap the width in a thumbnail URL
const resizeThumb = (url, width) => url.replace(/\/\d+px-/, `/${width}px-`);

// 24×24 icons for style cards, credits and nature sounds
const ICONS = {
  camera: '<path d="M9.2 4.5h5.6l1.3 1.8h2.4A2.5 2.5 0 0 1 21 8.8v8.7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5V8.8a2.5 2.5 0 0 1 2.5-2.5h2.4z"/><circle cx="12" cy="13" r="3.4" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.7"/>',
  note: '<path d="M19 4.6v10.9a2.9 2.9 0 1 1-1.8-2.7V8.2L10 9.8v7.7a2.9 2.9 0 1 1-1.8-2.7V6.6c0-.5.3-.9.8-1l8.8-2c.6-.1 1.2.3 1.2 1z"/>',
  headphones: '<path class="stroke" d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5"/>',
  vinyl: '<circle class="stroke" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.5"/><path class="stroke thin" d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5"/>',
  piano: '<rect class="stroke" x="3.5" y="5" width="17" height="14" rx="2"/><path d="M8 5h2.2v8H8zM13.8 5H16v8h-2.2z"/><path class="stroke thin" d="M9.1 13v6M14.9 13v6M12 5v14"/>',
  notes: '<path class="stroke" d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  leaf: '<path class="stroke" d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path class="stroke thin" d="M5 19l8-8"/>',
  heart: '<path class="stroke" d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
  rain: '<path d="M7 15.5a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.6 1.4 3.3 3.3 0 0 1-.2 6.6z"/><path class="stroke" d="M8.5 18.5l-1 2M12.5 18.5l-1 2M16.5 18.5l-1 2"/>',
  waves: '<path class="stroke" d="M3 9c1.5 0 1.5-1.5 3-1.5S7.5 9 9 9s1.5-1.5 3-1.5S13.5 9 15 9s1.5-1.5 3-1.5S19.5 9 21 9M3 13.5c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5M3 18c1.5 0 1.5-1.5 3-1.5S7.5 18 9 18s1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5"/>',
  bird: '<path fill-rule="evenodd" d="M11.5 6.5a4.5 4.5 0 0 1 4.3 3.2l4.2-.9c.5-.1.8.5.4.8l-3.9 3.1v.3c0 4.1-3.3 6.5-7 6.5H3.8c-.5 0-.7-.6-.3-.9 1.6-1.2 2.6-3 2.8-5.3V11a4.8 4.8 0 0 1 5.2-4.5zM13.1 10.6a.95.95 0 1 0 0-1.9.95.95 0 0 0 0 1.9z"/>',
  posLeft: '<rect class="stroke" x="3" y="5" width="18" height="14" rx="2.5"/><rect x="5.8" y="7.8" width="6" height="3" rx="1"/>',
  posCenter: '<rect class="stroke" x="3" y="5" width="18" height="14" rx="2.5"/><rect x="9" y="7.8" width="6" height="3" rx="1"/>',
  posRight: '<rect class="stroke" x="3" y="5" width="18" height="14" rx="2.5"/><rect x="12.2" y="7.8" width="6" height="3" rx="1"/>',
  // frame mode: the photo's window in the mat, with the clock line under it
  posBelowLeft: '<rect class="stroke" x="3" y="5" width="18" height="14" rx="2.5"/><rect x="6" y="7.5" width="12" height="6.5" rx="0.8" fill-opacity="0.35"/><rect x="6" y="15.4" width="5" height="1.7" rx="0.85"/>',
  posBelowCenter: '<rect class="stroke" x="3" y="5" width="18" height="14" rx="2.5"/><rect x="6" y="7.5" width="12" height="6.5" rx="0.8" fill-opacity="0.35"/><rect x="9.5" y="15.4" width="5" height="1.7" rx="0.85"/>',
  posBelowRight: '<rect class="stroke" x="3" y="5" width="18" height="14" rx="2.5"/><rect x="6" y="7.5" width="12" height="6.5" rx="0.8" fill-opacity="0.35"/><rect x="13" y="15.4" width="5" height="1.7" rx="0.85"/>',
  posMiddle: '<rect class="stroke" x="3" y="5" width="18" height="14" rx="2.5"/><rect x="7.5" y="10.2" width="9" height="3.6" rx="1.2"/>',
  flame: '<path d="M12 21.5c-3.9 0-6.5-2.6-6.5-6.2 0-3 1.8-5 3.4-6.8.5-.6 1.5-.2 1.5.6 0 1 .6 1.8 1.4 1.8.7 0 1.2-.6 1.2-1.4 0-1.8-.6-3.4-1.3-4.7-.4-.7.3-1.5 1-1.1 3.6 2 6.8 6.1 6.8 10.5 0 4.2-3 7.3-7.5 7.3z"/>',
};

// Internet Archive items licensed under Creative Commons or in the public domain
const MUSIC_STYLES = {
  lofi: {
    label: 'Lofi',
    icon: 'headphones',
    items: [
      'chillhop-raw-cuts',                       // Chillhop Music — CC BY-NC-ND 4.0
      'loyalty-freak-music-lofi-ambient-songs',  // Loyalty Freak Music — CC0
      'lofi-lion-tame-the-beast',                // CC BY 4.0
      'cozy-alone-lofi-chill-out-beats',         // CC BY-NC 4.0
    ],
  },
  jazz: {
    label: 'Jazz',
    icon: 'vinyl',
    items: [
      'DWK123',  // ProleteR — Curses From Past Times — CC BY-NC-ND 3.0
      'DWK127',  // Kova — Cookin' Session — CC BY-NC-ND 3.0
      'DWK217',  // Boogie Belgique — Nightwalker Vol. 1 — CC BY-NC-ND 3.0
    ],
  },
  piano: {
    label: 'Piano',
    icon: 'piano',
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
    icon: 'notes',
    items: [
      'musopen-chopin',  // Musopen — Chopin's complete works — CC0
      'Musopen-Libre',   // Musopen — symphonies — CC BY-SA 3.0
    ],
  },
  nature: {
    label: { pt: 'Natureza', en: 'Nature' },
    icon: 'leaf',
    items: [
      'relaxingrainsounds',          // rain — CC0
      'ocean-sea-sounds',            // ocean — CC0
      'naturesounds-soundtheraphy',  // birds, water — CC0
    ],
  },
};

// Nature sounds that can be layered over the music, each looping at its own volume (all CC0)
const IA = 'https://archive.org/download/';
const AMBIENT = {
  rain: { label: { pt: 'Chuva', en: 'Rain' }, icon: 'rain', url: `${IA}relaxingrainsounds/Rain%20Sounds.mp3` },
  waves: { label: { pt: 'Ondas', en: 'Waves' }, icon: 'waves', url: `${IA}ocean-sea-sounds/Gentle%20Ocean.mp3` },
  birds: { label: { pt: 'Pássaros', en: 'Birds' }, icon: 'bird', url: `${IA}naturesounds-soundtheraphy/Relaxing%20Nature%20Sounds%20-%20Birdsong%20Sound.mp3` },
  fire: { label: { pt: 'Lareira', en: 'Fireplace' }, icon: 'flame', url: `${IA}FireFavorite/Fire%20Favorite.mp3` },
};

// Empty WAV, played inside the start tap so Safari unlocks audio playback
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

const $ = (sel) => document.querySelector(sel);
const body = document.body;
const audio = $('#audio');
const slides = [$('#slideA'), $('#slideB')];

// Opened by "Show on TV": runs on the TV by itself and takes orders from the phone or computer
const isReceiver = new URLSearchParams(location.search).has('receiver');

const state = {
  started: false,
  paused: false,
  muted: false,
  volume: CONFIG.volume,
  slideMs: CONFIG.slideMs,
  photoStyle: 'landscapes',
  photoSource: null, // which list is playing; for "auto" it changes with the time of day
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
  ambient: Object.fromEntries(Object.keys(AMBIENT).map((key) => [key, { on: false, level: 0.5 }])),
  favorites: [],
  recent: [],
  clock: false,
  clockPos: 'center',
  clockSize: 'medium',
  frame: false,      // frame mode: a still photo in a mat
  mat: 'light',
  sleepAt: 0,
  sleepMinutes: 0,
  sleeping: false,
  cast: null,        // PresentationConnection while showing on a TV
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

function storedJson(key, fallback) {
  try { return JSON.parse(storage(key)) ?? fallback; } catch { return fallback; }
}

// ---------- lite mode ----------
// Weaker screens (TVs, streaming sticks, low-memory devices) get "lite": solid glass instead
// of a live blur, which has to be redrawn every frame over the moving photo, and smaller
// photos. It also switches on by itself if the crossfades stutter. ?lite=1 / ?lite=0 forces it.

const TV_AGENT = /SMART-TV|SmartTV|Tizen|Web0S|webOS|NetCast|HbbTV|CrKey|AFT[A-Z]|BRAVIA|Android TV|GoogleTV|Roku|PlayStation|Xbox/i;
const lowMemory = navigator.deviceMemory <= 2;
// on these it's always on; everywhere else it's a switch in the Display tab
const liteRequired = isReceiver || TV_AGENT.test(navigator.userAgent) || lowMemory;

function detectLite() {
  const forced = new URLSearchParams(location.search).get('lite');
  if (forced !== null) return forced !== '0';
  return liteRequired || storage('armony:lite') === '1';
}

let lite = detectLite();

function setLite(on) {
  lite = on;
  storage('armony:lite', on ? '1' : '0');
  body.classList.toggle('lite', on);
  $('#liteToggle').checked = on;
}

// The first few crossfades after the start are timed; under ~40 fps means the GPU is struggling.
// Skipped once someone has turned lite off by hand: their choice wins.
let fadeChecks = 3;
function checkSmoothness() {
  if (lite || storage('armony:lite') === '0' || fadeChecks <= 0 || document.hidden) return;
  fadeChecks--;
  const start = performance.now();
  let frames = 0;
  const count = (now) => {
    if (document.hidden) return;   // no frames in the background; that says nothing about the GPU
    frames++;
    if (now - start < CONFIG.fadeMs) requestAnimationFrame(count);
    else if (frames / (CONFIG.fadeMs / 1000) < 40) setLite(true);
  };
  requestAnimationFrame(count);
}

function creditLink(text, href) {
  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = text;
  return link;
}

function svgIcon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONS[name];
  return svg;
}

let toastTimer;
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => !el.classList.contains('show') && (el.hidden = true), 300);
  }, 2600);
}

// ---------- audio graph ----------
// Music and nature sounds go through Web Audio. Besides mixing, it's the only way to set
// volume on iPhone and iPad, where Safari ignores the volume of <audio> elements.

const mixer = { ctx: null, master: null, music: null };

function initAudioGraph() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (mixer.ctx || !AudioCtx) return;
  try {
    // play through the silent switch on iPhone, like any music app
    if (navigator.audioSession) navigator.audioSession.type = 'playback';
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.connect(ctx.destination);
    const music = ctx.createGain();
    music.gain.value = 0;
    music.connect(master);
    ctx.createMediaElementSource(audio).connect(music);
    Object.assign(mixer, { ctx, master, music });
    for (const layer of ambientLayers.values()) connectLayer(layer);
  } catch { /* fall back to plain <audio> volume */ }
}

// Smoothly move a gain (or an element's volume, without Web Audio) to a value
function rampTo(gainNode, element, value, seconds = 0.15) {
  if (mixer.ctx && gainNode) {
    const now = mixer.ctx.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(value, now + seconds);
  } else if (element && seconds <= 0) {
    element.volume = value;
  } else if (element) {
    const from = element.volume;
    const start = performance.now();
    const step = (time) => {
      const k = Math.min(1, (time - start) / (seconds * 1000));
      element.volume = Math.max(0, Math.min(1, from + (value - from) * k));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

// Everything that should make the whole mix silent: mute, the sleep fade, or showing on a TV
function masterLevel() {
  return state.muted || isCasting() ? 0 : 1;
}

function applyMaster(seconds = 0.2) {
  if (mixer.ctx) rampTo(mixer.master, null, masterLevel(), seconds);
  else {
    audio.muted = masterLevel() === 0;
    for (const layer of ambientLayers.values()) layer.el.muted = audio.muted;
  }
}

// ---------- photos (Wikimedia Commons) ----------

// Wikimedia serves fixed thumbnail sizes (1280, 1920, 3840…), about 0.5, 1 and 4 MB each.
// Screens wider than ~2000 physical pixels, like the iPad's, get 3840 so photos stay sharp
// while zoomed; low-memory devices and data-saver connections stay at 1920. Lite mode
// doesn't touch this: a bigger photo costs memory, not frame rate.
function photoWidth() {
  const longSide = Math.max(screen.width, screen.height) * (window.devicePixelRatio || 1);
  const connection = navigator.connection;
  const slow = connection?.saveData || /2g|3g/.test(connection?.effectiveType || '');
  if (longSide <= 1280) return 1280;
  return longSide <= 2048 || lowMemory || slow ? 1920 : 3840;
}

// Lists and favorites keep the URL they were saved with; bring it to this screen's size.
// Only ever smaller: a thumbnail wider than the original doesn't exist.
function photoUrl(url) {
  const width = Number(url.match(/\/(\d+)px-/)?.[1]);
  return width && photoWidth() < width ? resizeThumb(url, photoWidth()) : url;
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

// The list a style plays right now: "auto" depends on the time of day
function sourceFor(style) {
  return style === 'auto' ? `auto${periodIndex()}` : style;
}

function categoriesFor(source) {
  return source.startsWith('auto') ? PERIODS[Number(source.slice(4))].categories : PHOTO_STYLES[source].categories;
}

// Each source has a list that grows as its categories load. The Promise resolves as soon
// as the first page arrives; the rest is shuffled in ahead of the current photo.
const photoLists = new Map();

function loadPhotoSource(source) {
  if (source === 'favorites') return Promise.resolve(shuffle(state.favorites.slice()));
  if (photoLists.has(source)) return photoLists.get(source).ready;
  const list = [];
  const seen = new Set();
  let resolveReady;
  const ready = new Promise((r) => (resolveReady = r));
  photoLists.set(source, { list, ready });

  const add = (photos) => {
    for (const photo of photos) {
      if (seen.has(photo.url)) continue;
      seen.add(photo.url);
      const min = list === state.photos ? state.photoIndex + 1 : 0;
      list.splice(Math.floor(rand(min, list.length + 1)), 0, photo);
    }
  };

  (async () => {
    for (const category of shuffle([...categoriesFor(source)])) {
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
  img.crossOrigin = 'anonymous'; // lets the service worker keep a copy for offline starts
  img.decoding = 'async';
  img.alt = '';
  img.src = photoUrl(photo.url);
  await img.decode();
  return { photo, img };
}

// Keep trying until a photo loads. Now and then a favorite slips into the other styles.
async function preloadNext() {
  const favorites = state.favorites;
  if (state.photoStyle !== 'favorites' && favorites.length && Math.random() < 0.15) {
    const favorite = favorites[Math.floor(Math.random() * favorites.length)];
    if (favorite.page !== state.currentPhoto?.page) {
      try { return await preload(favorite); } catch { /* fall through to the list */ }
    }
  }
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
  if (state.frame) return;   // a framed print holds still
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
    duration: state.slideMs + CONFIG.fadeMs * 2 + 20000,
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
  // once it has faded out, the old photo leaves memory: a decoded 3840px photo is ~30 MB
  setTimeout(() => releaseSlide(outgoing), CONFIG.fadeMs + 200);

  state.currentPhoto = photo;
  renderPhotoCredit();
  rememberRecent(photo);
}

function releaseSlide(slide) {
  if (slide.classList.contains('visible')) return;   // it came back in the meantime
  const img = slide.querySelector('img');
  if (!img) return;
  img.getAnimations().forEach((a) => a.cancel());
  img.removeAttribute('src');   // Safari keeps the decoded pixels until the source goes
  img.remove();
}

// The last photos shown are remembered, so the app can start without a connection
function rememberRecent(photo) {
  state.recent = [photo, ...state.recent.filter((p) => p.page !== photo.page)].slice(0, CONFIG.maxRecent);
  storage('armony:recent', JSON.stringify(state.recent));
}

// One credit line: icon, linked title at full strength, then who made it in secondary color
function renderCredit(el, icon, title, href, meta) {
  const parts = [svgIcon(icon), creditLink(title, href)];
  if (meta) {
    const span = document.createElement('span');
    span.className = 'meta';
    span.textContent = meta;
    parts.push(span);
  }
  el.replaceChildren(...parts);
}

function renderPhotoCredit() {
  const photo = state.currentPhoto;
  if (!photo) return;
  const author = photo.artist || t('unknownAuthor');
  renderCredit($('#photoCredit'), 'camera', photo.title, photo.page, photo.license ? `${author}, ${photo.license}` : author);
  const fav = isFavorite(photo);
  $('#favBtn').setAttribute('aria-pressed', String(fav));
  setButtonLabel($('#favBtn'), fav ? 'unfavorite' : 'favorite');
}

async function advance() {
  if (state.transitioning || !state.nextReady) return;
  state.transitioning = true;
  const pending = state.nextReady;
  const next = await pending;
  state.transitioning = false;
  // the style changed while waiting: drop this one, the next tick retries with the new list
  if (pending !== state.nextReady) return;
  if (next) {
    showPhoto(next);
    checkSmoothness();
  }
  state.elapsed = 0;
  // the next download and decode wait until the crossfade is over, so they don't compete with it
  state.nextReady = wait(CONFIG.fadeMs).then(preloadNext);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A few checks a second are plenty for photos that stay 15 seconds or more; a per-frame
// loop would wake the CPU 60-120 times a second for nothing
function tick() {
  const now = performance.now();
  // cap the jump when the tab comes back from the background
  if (!state.paused && state.lastTick) state.elapsed += Math.min(now - state.lastTick, 1000);
  state.lastTick = now;
  if (state.elapsed >= state.slideMs) advance();
}

// Point the slideshow at a new list; the switch happens on the next frame with the usual crossfade
async function usePhotoSource(source) {
  state.photoSource = source;
  const list = await loadPhotoSource(source);
  if (state.photoSource !== source) return;
  state.photos = list;
  state.photoIndex = -1;
  state.nextReady = preloadNext();
  if (state.started) state.elapsed = state.slideMs;
}

function setPhotoStyle(style) {
  if (style === 'favorites' && !state.favorites.length) {
    toast(t('favEmpty'));
    return;
  }
  state.photoStyle = style;
  storage('armony:photoStyle', style);
  renderStyles();
  syncCast();
  return usePhotoSource(sourceFor(style));
}

// "Automatic" checks the clock every minute and moves on when the period changes
setInterval(() => {
  if (state.started && state.photoStyle === 'auto' && sourceFor('auto') !== state.photoSource) usePhotoSource(sourceFor('auto'));
}, 60000);

function setDuration(ms) {
  state.slideMs = ms;
  storage('armony:slideMs', String(ms));
  renderPickers();
  syncCast();
}

// ---------- favorites ----------

const isFavorite = (photo) => Boolean(photo) && state.favorites.some((f) => f.page === photo.page);

function toggleFavorite() {
  const photo = state.currentPhoto;
  if (!photo) return;
  if (isFavorite(photo)) {
    state.favorites = state.favorites.filter((f) => f.page !== photo.page);
    toast(t('favRemoved'));
  } else {
    state.favorites = [photo, ...state.favorites].slice(0, CONFIG.maxFavorites);
    toast(t('favAdded'));
  }
  storage('armony:favorites', JSON.stringify(state.favorites));
  renderPhotoCredit();
  renderStyles();
  syncCast();
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

let pendingTrackUrl = null; // on the TV: a track the phone picked before the list arrived

async function setMusicStyle(style) {
  state.musicStyle = style;
  storage('armony:musicStyle', style);
  renderStyles();
  const tracks = await loadMusicStyle(style);
  if (state.musicStyle !== style) return;
  state.tracks = shuffle(tracks.slice());
  renderPlaylist();
  const wanted = pendingTrackUrl ? state.tracks.findIndex((track) => track.url === pendingTrackUrl) : -1;
  pendingTrackUrl = null;
  if (state.started) playTrack(Math.max(0, wanted));
}

let trackToken = 0;
let skipTimer;

function playTrack(index) {
  if (!state.tracks.length) return;
  const token = ++trackToken;
  clearTimeout(skipTimer);
  state.trackIndex = (index + state.tracks.length) % state.tracks.length;
  const track = state.tracks[state.trackIndex];

  // while a TV is playing, this device only follows along on screen
  if (!isCasting()) {
    audio.src = track.url;
    rampTo(mixer.music, audio, 0, 0);
    if (!state.paused) {
      audio.play().then(() => token === trackToken && rampTo(mixer.music, audio, state.volume, 2.5)).catch(() => {});
    }
  }

  renderCredit($('#trackCredit'), 'note', track.title, track.page, track.artist);
  renderPlaylist();
  sendCast({ type: 'track', style: state.musicStyle, url: track.url });

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
  if (!isCasting() && audio.currentTime > 3) audio.currentTime = 0;
  else playTrack(state.trackIndex - 1);
}
const nextTrack = () => playTrack(state.trackIndex + 1);

function setVolume(value) {
  state.volume = value;
  storage('armony:volume', String(value));
  rampTo(mixer.music, audio, value, 0.12);
  renderVolume();
  syncCast();
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
audio.addEventListener('play', () => !playingSilence() && !isReceiver && channel?.postMessage({ playing: instanceId }));
if (channel && !isReceiver) {
  channel.onmessage = (e) => {
    if (e.data?.playing && e.data.playing !== instanceId && !state.paused && !isCasting()) setPaused(true);
  };
}
window.addEventListener('pagehide', () => {
  audio.pause();
  for (const layer of ambientLayers.values()) layer.el.pause();
});

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

// ---------- nature sounds ----------

const ambientLayers = new Map();

function connectLayer(layer) {
  if (!mixer.ctx || layer.gain) return;
  layer.gain = mixer.ctx.createGain();
  layer.gain.gain.value = 0;
  layer.gain.connect(mixer.master);
  mixer.ctx.createMediaElementSource(layer.el).connect(layer.gain);
  // the gain node sets the level now; Chrome and Firefox still apply the element's own volume
  // before Web Audio, so leaving it at 0 would silence the layer
  layer.el.volume = 1;
}

function ambientLayer(key) {
  if (!ambientLayers.has(key)) {
    const el = new Audio();
    el.crossOrigin = 'anonymous';
    el.loop = true;
    el.preload = 'none';
    el.src = AMBIENT[key].url;
    el.volume = 0;
    const layer = { el, gain: null };
    connectLayer(layer);
    ambientLayers.set(key, layer);
  }
  return ambientLayers.get(key);
}

// Bring one layer in line with its setting and with play/pause
function applyAmbient(key) {
  const { on, level } = state.ambient[key];
  const audible = on && state.started && !state.paused && !isCasting();
  if (!audible && !ambientLayers.has(key)) return;
  const layer = ambientLayer(key);
  if (audible) {
    layer.el.play().catch(() => {});
    rampTo(layer.gain, layer.el, level, 1.2);
  } else {
    rampTo(layer.gain, layer.el, 0, 0.6);
    clearTimeout(layer.pauseTimer);
    layer.pauseTimer = setTimeout(() => {
      const current = state.ambient[key];
      if (!(current.on && state.started && !state.paused && !isCasting())) layer.el.pause();
    }, 700);
  }
}

const applyAllAmbient = () => Object.keys(AMBIENT).forEach(applyAmbient);

function setAmbient(key, changes) {
  state.ambient[key] = { ...state.ambient[key], ...changes };
  storage('armony:ambient', JSON.stringify(state.ambient));
  applyAmbient(key);
  renderAmbient();
  syncCast();
}

// ---------- clock ----------

let clockTimer;

// Like the Lock Screen: no leading zero on the hour ("0:29", "9:41") and no AM/PM
function clockText(date) {
  return new Intl.DateTimeFormat(locale(), { hour: 'numeric', minute: '2-digit' })
    .formatToParts(date)
    .filter((part) => part.type === 'hour' || part.type === 'minute' || (part.type === 'literal' && part.value.trim() === ':'))
    .map((part) => part.value)
    .join('');
}

function renderClock() {
  clearTimeout(clockTimer);
  if (!state.clock) return;
  const now = new Date();
  const time = clockText(now);
  $('#clockTime').textContent = time;
  // short date, as on the iOS 26 Lock Screen: "Tue Sep 9", "Sex. 25 de set."
  const date = new Intl.DateTimeFormat(locale(), { weekday: 'short', day: 'numeric', month: 'short' }).format(now).replace(',', '');
  $('#clockDate').textContent = date.charAt(0).toUpperCase() + date.slice(1);
  // wake up right at the next minute
  clockTimer = setTimeout(renderClock, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
}

function setClock(on) {
  state.clock = on;
  storage('armony:clock', on ? '1' : '0');
  $('#clock').hidden = !on;
  $('#clockToggle').checked = on;
  $('#clockPosRow').hidden = !on;
  renderClock();
  syncCast();
}

function setClockSize(size) {
  state.clockSize = size;
  storage('armony:clockSize', size);
  $('#clock').dataset.size = size;
  renderPickers();
  syncCast();
}

function setClockPos(pos) {
  state.clockPos = pos;
  storage('armony:clockPos', pos);
  $('#clock').dataset.pos = pos;
  renderPickers();
  syncCast();
}

// ---------- frame mode ----------

const stage = $('#stage');

function applyFrame() {
  body.classList.toggle('frame', state.frame);
  body.dataset.mat = state.mat;
  // in the mat the clock sits under the photo, so its positions read differently
  renderPickers();
  // the photos in place start moving again, or come to rest
  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    if (img) kenBurns(img);
  });
}

let frameTimer;
function setFrame(on) {
  state.frame = on;
  storage('armony:frame', on ? '1' : '0');
  $('#frameToggle').checked = on;
  $('#matRow').hidden = !on;
  syncCast();
  clearTimeout(frameTimer);
  if (!state.started || reducedMotion.matches) {
    stage.classList.remove('switching', 'hiding');
    applyFrame();
    return;
  }
  // the photo fades out, the layout changes out of sight, then it fades back in
  stage.classList.add('switching', 'hiding');
  frameTimer = setTimeout(() => {
    applyFrame();
    stage.classList.remove('hiding');
    frameTimer = setTimeout(() => stage.classList.remove('switching'), 450);
  }, 450);
}

function setMat(mat) {
  state.mat = mat;
  storage('armony:mat', mat);
  body.dataset.mat = mat;
  renderPickers();
  syncCast();
}

// ---------- sleep timer ----------

const shade = $('#sleepShade');
const timeFormat = (ms) => new Intl.DateTimeFormat(locale(), { hour: 'numeric', minute: '2-digit' }).format(new Date(ms));

function setSleep(minutes) {
  state.sleepMinutes = minutes;
  state.sleepAt = minutes ? Date.now() + minutes * 60000 : 0;
  if (state.sleeping) cancelSleepFade();
  renderSleep();
  syncCast();
}

function renderSleep() {
  $('#sleepNote').textContent = state.sleepAt ? t('sleepAt').replace('{time}', timeFormat(state.sleepAt)) : '';
  renderSleepBadge();
  renderPickers();
}

// While the timer runs, a moon with the time left sits in the control bar; tapping it opens the setting
function renderSleepBadge() {
  const button = $('#sleepBtn');
  button.hidden = !state.sleepAt;
  if (!state.sleepAt) return;
  const seconds = Math.max(0, Math.ceil((state.sleepAt - Date.now()) / 1000));
  const text = seconds < 60 ? `0:${String(seconds).padStart(2, '0')}` : `${Math.ceil(seconds / 60)} min`;
  $('#sleepLeft').textContent = text;
  button.title = `${t('sleepTimer')}: ${text}`;
  button.setAttribute('aria-label', button.title);
}

$('#sleepBtn').addEventListener('click', () => {
  setTab('display');
  setPanel(true);
});

function startSleepFade(ms) {
  state.sleeping = true;
  shade.hidden = false;
  shade.classList.remove('asleep');
  shade.style.transitionDuration = `${ms}ms`;
  // read a layout value so the browser applies the visible, transparent state first;
  // otherwise it can skip the transition and go black at once
  void shade.offsetWidth;
  shade.classList.add('dark');
  if (mixer.ctx) rampTo(mixer.master, null, 0, ms / 1000);
  else {
    rampTo(null, audio, 0, ms / 1000);
    for (const layer of ambientLayers.values()) rampTo(null, layer.el, 0, ms / 1000);
  }
}

function cancelSleepFade() {
  state.sleeping = false;
  shade.classList.remove('dark', 'asleep');
  shade.style.transitionDuration = '';
  shade.hidden = true;
  applyMaster(0.8);
  if (!mixer.ctx) {
    rampTo(null, audio, state.volume, 0.8);
    applyAllAmbient();
  }
}

// Fall asleep: everything is paused and the screen stays black until someone taps it
function finishSleep() {
  state.sleepAt = 0;
  state.sleepMinutes = 0;
  setPaused(true);
  shade.classList.add('asleep');
  state.wakeLock?.release?.().catch(() => {});
  state.wakeLock = null;
  renderSleep();
}

shade.addEventListener('click', () => {
  if (!shade.classList.contains('asleep')) return;
  cancelSleepFade();
  setPaused(false);
  keepAwake();
});

setInterval(() => {
  if (!state.sleepAt) return;
  renderSleepBadge();
  const remaining = state.sleepAt - Date.now();
  if (remaining <= 0) finishSleep();
  else if (remaining <= CONFIG.sleepFadeMs && !state.sleeping) startSleepFade(remaining);
}, 1000);

// ---------- showing on a TV ----------
// Chrome can present this app on a Chromecast or smart TV (Presentation API). The TV runs
// its own copy and this device becomes the remote. Safari has no such API for web pages,
// so there we point to Screen Mirroring instead.

const castMode = !isReceiver && 'PresentationRequest' in window ? 'presentation'
  : !isReceiver && 'WebKitPlaybackTargetAvailabilityEvent' in window ? 'mirror'
  : null;

const isCasting = () => state.cast?.state === 'connected';

function sendCast(message) {
  if (isCasting()) {
    try { state.cast.send(JSON.stringify(message)); } catch { /* connection closing */ }
  }
}

// The TV mirrors every setting; sent whenever something changes here
let syncTimer;
function syncCast() {
  if (!isCasting()) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => sendCast({
    type: 'settings',
    lang,
    paused: state.paused,
    volume: state.volume,
    muted: state.muted,
    slideMs: state.slideMs,
    photoStyle: state.photoStyle,
    musicStyle: state.musicStyle,
    ambient: state.ambient,
    clock: state.clock,
    clockPos: state.clockPos,
    clockSize: state.clockSize,
    frame: state.frame,
    mat: state.mat,
    favorites: state.favorites,
  }), 60);
}

function startCast() {
  const url = new URL(location.href);
  url.search = '?receiver=1';
  url.hash = '';
  new PresentationRequest([url.href]).start()
    .then(watchCast)
    .catch((error) => {
      // the person closed the device picker: nothing to report
      if (!['NotAllowedError', 'AbortError'].includes(error?.name)) toast(t('castError'));
    });
}

function watchCast(connection) {
  state.cast = connection;
  const onConnect = () => {
    body.classList.add('casting');
    audio.pause();
    applyAllAmbient();
    applyMaster();
    syncCast();
    const track = state.tracks[state.trackIndex];
    if (track) sendCast({ type: 'track', style: state.musicStyle, url: track.url });
    renderCast();
    toast(t('castStarted'));
  };
  const onEnd = () => {
    if (state.cast !== connection) return;
    state.cast = null;
    body.classList.remove('casting');
    applyMaster();
    // pick the music back up here
    if (state.started && !state.paused) playTrack(state.trackIndex);
    applyAllAmbient();
    renderCast();
    toast(t('castEnded'));
  };
  connection.addEventListener('connect', onConnect);
  connection.addEventListener('close', onEnd);
  connection.addEventListener('terminate', onEnd);
  if (connection.state === 'connected') onConnect();
}

function renderCast() {
  const btn = $('#castBtn');
  btn.hidden = !castMode;
  $('#castLabel').textContent = t(isCasting() ? 'castStop' : 'cast');
  $('#castValue').textContent = isCasting() ? t('castOn') : '';
}

$('#castBtn').addEventListener('click', () => {
  if (castMode === 'presentation') {
    if (isCasting()) state.cast.terminate();
    else startCast();
  } else if (castMode === 'mirror') {
    showDisplayNote('castMirrorHelp');
  }
});

// On the TV: apply what the remote sends
function applyRemote(message) {
  if (message.type === 'track') {
    if (message.style !== state.musicStyle) {
      pendingTrackUrl = message.url;
      setMusicStyle(message.style);
      return;
    }
    const index = state.tracks.findIndex((track) => track.url === message.url);
    if (index >= 0) playTrack(index);
    else pendingTrackUrl = message.url;
  } else if (message.type === 'settings') {
    if (message.lang !== lang && message.lang in I18N) setLang(message.lang);
    if (message.volume !== state.volume) setVolume(message.volume);
    if (message.muted !== state.muted) setMuted(message.muted);
    if (message.slideMs !== state.slideMs) setDuration(message.slideMs);
    if (message.clock !== state.clock) setClock(message.clock);
    if (message.clockPos !== state.clockPos && CONFIG.clockPositions.includes(message.clockPos)) setClockPos(message.clockPos);
    if (message.clockSize !== state.clockSize && CONFIG.clockSizes.includes(message.clockSize)) setClockSize(message.clockSize);
    if (message.mat !== state.mat && CONFIG.mats.includes(message.mat)) setMat(message.mat);
    if (typeof message.frame === 'boolean' && message.frame !== state.frame) setFrame(message.frame);
    state.favorites = message.favorites || [];
    if (message.photoStyle !== state.photoStyle) setPhotoStyle(message.photoStyle);
    for (const key of Object.keys(AMBIENT)) {
      const next = message.ambient?.[key];
      const current = state.ambient[key];
      if (next && (next.on !== current.on || next.level !== current.level)) setAmbient(key, next);
    }
    if (message.paused !== state.paused) setPaused(message.paused);
  } else if (message.type === 'nextPhoto') {
    advance();
  }
}

if (isReceiver && navigator.presentation?.receiver) {
  navigator.presentation.receiver.connectionList.then((list) => {
    const listen = (connection) => connection.addEventListener('message', (e) => {
      try { applyRemote(JSON.parse(e.data)); } catch { /* ignore malformed messages */ }
    });
    list.connections.forEach(listen);
    list.addEventListener('connectionavailable', (e) => listen(e.connection));
  });
}

// ---------- installing the app ----------

let installPrompt = null;
const isStandalone = () => matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches || navigator.standalone === true;
const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e;
  renderInstall();
});
window.addEventListener('appinstalled', () => {
  installPrompt = null;
  renderInstall();
  toast(t('installed'));
});

function renderInstall() {
  $('#installBtn').hidden = isReceiver || isStandalone() || !(installPrompt || isAppleMobile);
}

$('#installBtn').addEventListener('click', async () => {
  if (installPrompt) {
    installPrompt.prompt();
    await installPrompt.userChoice.catch(() => {});
    installPrompt = null;
    renderInstall();
  } else if (isAppleMobile) {
    showDisplayNote('installIosHelp');
  }
});

function showDisplayNote(key) {
  const note = $('#displayNote');
  note.dataset.i18n = key;
  note.textContent = t(key);
  note.hidden = false;
}

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* works fine without it */ });
}

// ---------- settings panel ----------

function styleCard(key, current, onPick, content) {
  const card = document.createElement('button');
  card.type = 'button';
  card.setAttribute('aria-pressed', String(key === current));
  card.addEventListener('click', () => key !== current && onPick(key));
  card.append(...content);
  return card;
}

function renderStyles() {
  const cardParts = (art, style) => {
    const tile = document.createElement('span');
    tile.className = 'art';
    tile.append(art);
    const name = document.createElement('span');
    name.className = 'card-name';
    name.textContent = label(style);
    return [tile, name];
  };

  $('#musicCards').replaceChildren(...Object.entries(MUSIC_STYLES).map(([key, style]) => {
    const card = styleCard(key, state.musicStyle, setMusicStyle, cardParts(svgIcon(style.icon), style));
    card.className = 'music-card';
    return card;
  }));

  $('#photoCards').replaceChildren(...Object.entries(PHOTO_STYLES).map(([key, style]) => {
    let art;
    // favorites use the latest favorite as their cover, or a heart until there is one
    const cover = key === 'favorites' ? state.favorites[0] && resizeThumb(state.favorites[0].url, 500) : style.cover && coverUrl(style.cover);
    if (cover) {
      art = document.createElement('img');
      art.src = cover;
      art.alt = '';
      art.loading = 'lazy';
      art.decoding = 'async';
    } else {
      art = svgIcon('heart');
    }
    const card = styleCard(key, state.photoStyle, setPhotoStyle, cardParts(art, style));
    card.className = 'photo-card';
    if (!cover) card.classList.add('empty');
    return card;
  }));

  renderPicker($('#langToggle'), Object.entries(LANGUAGES).map(([key, item]) => ({ value: key, text: item.label, title: item.name })), lang, setLang);
}

// Segmented control with a sliding thumb; `--index` moves the thumb
function renderPicker(container, options, current, onPick) {
  const thumb = document.createElement('span');
  thumb.className = 'thumb';
  const index = Math.max(0, options.findIndex((o) => o.value === current));
  container.style.setProperty('--count', options.length);
  container.style.setProperty('--index', index);
  container.replaceChildren(thumb, ...options.map((option) => {
    const btn = styleCard(option.value, current, onPick, [option.icon ? svgIcon(option.icon) : option.text]);
    if (option.title) {
      btn.title = option.title;
      btn.setAttribute('aria-label', option.title);
    }
    return btn;
  }));
}

function renderPickers() {
  const durationText = (ms) => (ms < 60000 ? `${ms / 1000} s` : `${ms / 60000} min`);
  renderPicker($('#durationPicker'), CONFIG.durations.map((ms) => ({ value: ms, text: durationText(ms) })), state.slideMs, setDuration);
  const posIcon = state.frame
    ? { left: 'posBelowLeft', center: 'posBelowCenter', right: 'posBelowRight', middle: 'posMiddle' }
    : { left: 'posLeft', center: 'posCenter', right: 'posRight', middle: 'posMiddle' };
  const posKey = state.frame
    ? { left: 'clockBelowLeft', center: 'clockBelowCenter', right: 'clockBelowRight', middle: 'clockMiddle' }
    : { left: 'clockLeft', center: 'clockCenter', right: 'clockRight', middle: 'clockMiddle' };
  renderPicker($('#clockPosPicker'), CONFIG.clockPositions.map((pos) => ({ value: pos, icon: posIcon[pos], title: t(posKey[pos]) })), state.clockPos, setClockPos);
  const sizeKey = { small: 'sizeSmall', medium: 'sizeMedium', large: 'sizeLarge' };
  renderPicker($('#clockSizePicker'), CONFIG.clockSizes.map((size) => ({ value: size, text: t(sizeKey[size]) })), state.clockSize, setClockSize);
  const matKey = { light: 'matLight', dark: 'matDark' };
  renderPicker($('#matPicker'), CONFIG.mats.map((mat) => ({ value: mat, text: t(matKey[mat]) })), state.mat, setMat);
  renderPicker($('#sleepPicker'), CONFIG.sleepOptions.map((m) => ({ value: m, text: m ? (m < 1 ? `${m * 60} s` : m < 60 ? `${m} min` : `${m / 60} h`) : t('sleepOff') })), state.sleepMinutes, setSleep);
}

function renderVolume() {
  const input = $('#volume');
  input.value = state.volume;
  input.style.setProperty('--fill', `${state.volume * 100}%`);
}

// Grouped rows like the Display tab: a switch per sound, and its volume slides in below when on
function renderAmbient() {
  const list = $('#ambientList');
  // keep the rows while a slider is being dragged; only refresh their state
  if (list.children.length !== Object.keys(AMBIENT).length) {
    list.replaceChildren(...Object.entries(AMBIENT).map(([key, sound]) => {
      const item = document.createElement('div');
      item.className = 'ambient-item';
      item.dataset.key = key;
      const row = document.createElement('label');
      row.className = 'row';
      const icon = document.createElement('span');
      icon.className = 'row-icon';
      icon.append(svgIcon(sound.icon));
      const name = document.createElement('span');
      name.className = 'row-label';
      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.className = 'switch';
      toggle.setAttribute('role', 'switch');
      toggle.addEventListener('change', () => setAmbient(key, { on: toggle.checked }));
      row.append(icon, name, toggle);
      const control = document.createElement('div');
      control.className = 'row row-control';
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.className = 'slider';
      slider.min = '0';
      slider.max = '1';
      slider.step = '0.01';
      slider.addEventListener('input', () => setAmbient(key, { level: Number(slider.value) }));
      control.append(slider);
      item.append(row, control);
      return item;
    }));
  }
  for (const item of list.children) {
    const key = item.dataset.key;
    const { on, level } = state.ambient[key];
    const name = label(AMBIENT[key]);
    const toggle = item.querySelector('.switch');
    const slider = item.querySelector('.slider');
    item.querySelector('.row-label').textContent = name;
    toggle.checked = on;
    item.querySelector('.row-control').hidden = !on;
    slider.setAttribute('aria-label', name);
    if (Number(slider.value) !== level) slider.value = level;
    slider.style.setProperty('--fill', `${level * 100}%`);
  }
}

function renderPlaylist() {
  const list = $('#trackList');
  $('#trackCount').textContent = state.tracks.length ? `${state.tracks.length} ${t('tracks')}` : '';
  list.replaceChildren(...state.tracks.map((track, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    const num = document.createElement('span');
    num.className = 'track-num';
    num.textContent = i + 1;
    const text = document.createElement('span');
    text.className = 'track-text';
    const title = document.createElement('span');
    title.className = 'track-title';
    title.textContent = track.title;
    const artist = document.createElement('span');
    artist.className = 'track-artist';
    artist.textContent = track.artist;
    text.append(title, artist);
    btn.append(num, text);
    if (i === state.trackIndex && state.started) {
      li.className = 'current';
      btn.setAttribute('aria-current', 'true');
      // animated equalizer in place of the number
      num.replaceChildren(...[0, 1, 2].map(() => document.createElement('i')));
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
const panelBody = $('.panel-body');
const panelOpen = () => !panel.hidden && !panel.classList.contains('closing');
const TABS = ['music', 'photos', 'display'];
let panelTab = 'music';

function setTab(tab) {
  panelTab = tab;
  for (const name of TABS) {
    const button = $(`.tab[data-tab="${name}"]`);
    button.setAttribute('aria-selected', String(name === tab));
    $(`#${button.getAttribute('aria-controls')}`).hidden = name !== tab;
  }
  $('.tabs').style.setProperty('--index', TABS.indexOf(tab));
  // each tab opens at the top, where its main controls are
  panelBody.scrollTop = 0;
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function setPanel(open) {
  $('#listBtn').setAttribute('aria-expanded', String(open));
  body.classList.toggle('panel-open', open);
  if (open) {
    panel.classList.remove('closing');
    panel.style.transform = '';
    panel.hidden = false;
    setTab(panelTab);
  } else if (panelOpen()) {
    // play the closing animation first, then hide
    if (reducedMotion.matches) panel.hidden = true;
    else {
      panel.classList.add('closing');
      panel.addEventListener('animationend', () => {
        if (!panel.classList.contains('closing')) return;
        panel.classList.remove('closing');
        panel.style.transform = '';
        panel.hidden = true;
      }, { once: true });
    }
  }
  wake();
}

// On phones the panel is a sheet: drag the grabber or header down to dismiss it
const phoneSheet = matchMedia('(max-width: 600px) and (orientation: portrait)');
let drag = null;

panel.addEventListener('pointerdown', (e) => {
  if (!phoneSheet.matches || !e.target.closest('.grabber, .panel-head') || e.target.closest('button')) return;
  drag = { startY: e.clientY, lastY: e.clientY, lastT: performance.now(), velocity: 0 };
  panel.classList.add('dragging');
  panel.setPointerCapture(e.pointerId);
});
panel.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const now = performance.now();
  drag.velocity = (e.clientY - drag.lastY) / Math.max(1, now - drag.lastT);
  drag.lastY = e.clientY;
  drag.lastT = now;
  // pulling up resists; pulling down follows the finger
  const dy = e.clientY - drag.startY;
  panel.style.transform = `translateY(${dy > 0 ? dy : dy / 6}px)`;
});
function endDrag(e) {
  if (!drag) return;
  // a cancelled pointer can report a stale position, so fall back to the last move
  const dy = (e.type === 'pointercancel' ? drag.lastY : e.clientY) - drag.startY;
  const dismiss = dy > 110 || (dy > 20 && drag.velocity > 0.5);
  drag = null;
  panel.classList.remove('dragging');
  if (dismiss) setPanel(false);
  else {
    panel.style.transition = 'transform 0.45s var(--ease-sheet)';
    panel.style.transform = '';
    setTimeout(() => (panel.style.transition = ''), 450);
  }
}
panel.addEventListener('pointerup', endDrag);
panel.addEventListener('pointercancel', endDrag);

// ---------- on-screen text ----------

// Buttons keep their text key in data-i18n-label; the title also shows the keyboard shortcut
function setButtonLabel(el, key) {
  el.dataset.i18nLabel = key;
  const text = t(key);
  el.setAttribute('aria-label', text);
  if (el.dataset.key) el.title = `${text} (${t(el.dataset.key)})`;
}

function setStatus(key) {
  const status = $('#startStatus');
  status.dataset.i18n = key;
  status.textContent = key ? t(key) : '';
}

function applyI18n() {
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = el.dataset.i18n ? t(el.dataset.i18n) : ''));
  document.querySelectorAll('[data-i18n-label]').forEach((el) => setButtonLabel(el, el.dataset.i18nLabel));
  renderStyles();
  renderPickers();
  renderAmbient();
  renderPlaylist();
  renderPhotoCredit();
  renderClock();
  renderSleep();
  renderCast();
}

function setLang(next) {
  lang = next;
  storage('armony:lang', next);
  applyI18n();
  syncCast();
}

// ---------- controls ----------

function setPaused(paused) {
  state.paused = paused;
  body.classList.toggle('paused', paused);
  setButtonLabel($('#playBtn'), paused ? 'play' : 'pause');
  slides.forEach((s) => s.querySelector('img')?.getAnimations().forEach((a) => (paused ? a.pause() : a.play())));
  if (!paused) mixer.ctx?.resume().catch(() => {}); // iOS suspends Web Audio after interruptions
  if (paused || isCasting()) audio.pause();
  else if (audio.src && !playingSilence()) audio.play().catch(() => {});
  applyAllAmbient();
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = paused ? 'paused' : 'playing';
  syncCast();
}

function setMuted(muted) {
  state.muted = muted;
  body.classList.toggle('muted', muted);
  setButtonLabel($('#muteBtn'), muted ? 'unmute' : 'mute');
  storage('armony:muted', muted ? '1' : '0');
  applyMaster();
  syncCast();
}

function toggleFullscreen() {
  const el = document.documentElement;
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  } else {
    (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
  }
}

function nextPhoto() {
  advance();
  sendCast({ type: 'nextPhoto' });
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
$('#muteBtn').addEventListener('click', () => setMuted(!state.muted));
$('#listBtn').addEventListener('click', () => setPanel(!panelOpen()));
$('#favBtn').addEventListener('click', toggleFavorite);
$('#closePanel').addEventListener('click', () => setPanel(false));
for (const name of TABS) $(`.tab[data-tab="${name}"]`).addEventListener('click', () => setTab(name));
$('#fsBtn').addEventListener('click', toggleFullscreen);
$('#volume').addEventListener('input', (e) => setVolume(Number(e.target.value)));
$('#clockToggle').addEventListener('change', (e) => setClock(e.target.checked));
$('#liteToggle').addEventListener('change', (e) => setLite(e.target.checked));
$('#frameToggle').addEventListener('change', (e) => setFrame(e.target.checked));

// Tapping the photo closes the panel; the control bar stays usable while it's open
document.addEventListener('pointerdown', (e) => {
  if (panelOpen() && !panel.contains(e.target) && !$('#controls').contains(e.target)) setPanel(false);
});

document.addEventListener('keydown', (e) => {
  if (!state.started || e.target instanceof HTMLInputElement) return;
  if (e.key === 'Escape' && panelOpen()) setPanel(false);
  else if (e.code === 'Space' && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); setPaused(!state.paused); }
  else if (e.key === 'm' || e.key === 'M') setMuted(!state.muted);
  else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
  else if (e.key === 'p' || e.key === 'P') setPanel(!panelOpen());
  else if (e.key === 'l' || e.key === 'L') toggleFavorite();
  else if (e.key === 'ArrowRight') nextPhoto();
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
if (!isReceiver) {
  ['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach((evt) =>
    document.addEventListener(evt, wake, { passive: true })
  );
}

// Keep the screen awake (it's a picture frame, after all)
async function keepAwake() {
  try { state.wakeLock = await navigator.wakeLock?.request('screen'); } catch { /* not supported */ }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !state.started) return;
  if (!state.paused) mixer.ctx?.resume().catch(() => {});
  if (!shade.classList.contains('asleep')) keepAwake();
});

// ---------- startup ----------

const savedLang = storage('armony:lang');
lang = savedLang in I18N ? savedLang : detectLang();
const savedPhoto = storage('armony:photoStyle');
const savedMusic = storage('armony:musicStyle');
state.favorites = storedJson('armony:favorites', []);
state.recent = storedJson('armony:recent', []);
if (savedPhoto in PHOTO_STYLES && !(savedPhoto === 'favorites' && !state.favorites.length)) state.photoStyle = savedPhoto;
if (savedMusic in MUSIC_STYLES) state.musicStyle = savedMusic;
state.volume = Number(storage('armony:volume') ?? CONFIG.volume);
if (!(state.volume >= 0 && state.volume <= 1)) state.volume = CONFIG.volume;
const savedDuration = Number(storage('armony:slideMs'));
if (CONFIG.durations.includes(savedDuration)) state.slideMs = savedDuration;
const savedAmbient = storedJson('armony:ambient', {});
for (const key of Object.keys(AMBIENT)) {
  const saved = savedAmbient[key];
  if (saved && typeof saved.on === 'boolean' && saved.level >= 0 && saved.level <= 1) state.ambient[key] = saved;
}
state.clock = storage('armony:clock') === '1';
const savedClockPos = storage('armony:clockPos');
if (CONFIG.clockPositions.includes(savedClockPos)) state.clockPos = savedClockPos;
const savedClockSize = storage('armony:clockSize');
if (CONFIG.clockSizes.includes(savedClockSize)) state.clockSize = savedClockSize;
$('#clock').dataset.size = state.clockSize;
$('#clock').hidden = !state.clock;
$('#clock').dataset.pos = state.clockPos;
$('#clockToggle').checked = state.clock;
$('#clockPosRow').hidden = !state.clock;
state.frame = storage('armony:frame') === '1';
const savedMat = storage('armony:mat');
if (CONFIG.mats.includes(savedMat)) state.mat = savedMat;
$('#frameToggle').checked = state.frame;
$('#matRow').hidden = !state.frame;
applyFrame();
if (isReceiver) body.classList.add('receiver');
if (lite) body.classList.add('lite');
$('#liteToggle').checked = lite;
$('#liteGroup').hidden = liteRequired;
applyI18n();
renderVolume();
renderInstall();

// Start downloading while the start screen is still showing: the photo list, the first
// photo at full size, and a tiny copy of it that sits blurred behind the title.
// Offline, the photos shown last time are used instead.
const offline = navigator.onLine === false && state.recent.length > 0;
state.photoSource = sourceFor(state.photoStyle);
const photosLoading = offline ? Promise.resolve(state.recent.slice()) : loadPhotoSource(state.photoSource);
setMusicStyle(state.musicStyle);

const firstPhoto = photosLoading.then((list) => {
  state.photos = list;
  state.photoIndex = -1;
  if (!list.length) return null;
  const thumb = new Image();
  thumb.onload = () => {
    $('#startBg').style.backgroundImage = `url("${thumb.src}")`;
    $('#startBg').classList.add('ready');
  };
  thumb.src = resizeThumb(list[0].url, 330);
  return preloadNext();
});

async function startApp() {
  if (state.started) return;
  state.started = true;
  initAudioGraph();
  mixer.ctx?.resume().catch(() => {});
  setMuted(storage('armony:muted') === '1');
  keepAwake();

  // Play something inside the tap itself so the browser allows autoplay (Safari/iOS).
  // If the tracks haven't arrived yet, setMusicStyle starts playback when they do.
  if (state.tracks.length) playTrack(0);
  else {
    audio.src = SILENCE;
    audio.play().catch(() => {});
  }
  applyAllAmbient();

  const slow = setTimeout(() => setStatus('loading'), 400);
  const first = await firstPhoto;
  clearTimeout(slow);
  if (!first) {
    setStatus('photoError');
    return;
  }
  setStatus('');
  showPhoto(first);
  state.nextReady = preloadNext();
  // title steps back, the blurred photo comes into focus, then the real one takes over
  $('#start').classList.add('revealing', 'gone');
  // after the reveal, take the start screen out entirely: its blurred layer would still be composited
  setTimeout(() => {
    $('#start').hidden = true;
    $('#startBg').style.backgroundImage = '';
  }, 1600);
  wake();
  setInterval(tick, 250);
}

$('#startBtn').addEventListener('click', startApp);

// The TV has no one to press Start, so it starts on its own
if (isReceiver) startApp();
