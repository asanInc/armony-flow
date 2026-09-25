'use strict';

// Service worker: makes Armony Flow installable and lets it start on a shaky connection.
// - the app itself: network first, so updates arrive, with the cached copy as fallback
// - photo and track lists (Wikimedia/Internet Archive APIs): network first, cache as fallback
// - photos: cache first, keeping only the most recent ones
// - music is streamed and never cached (range requests, and it would take too much space)

const VERSION = 'v1';
const SHELL = `armony-shell-${VERSION}`;
const DATA = `armony-data-${VERSION}`;
const PHOTOS = `armony-photos-${VERSION}`;
const MAX_PHOTOS = 30;   // as many as app.js remembers for offline starts; up to ~4 MB each

const SHELL_FILES = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then((cache) => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  const keep = [SHELL, DATA, PHOTOS];
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => !keep.includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: cacheName === SHELL });
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(request, cacheName, limit) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
    const keys = await cache.keys();
    // cache.keys() is in insertion order, so the oldest photos go first
    await Promise.all(keys.slice(0, Math.max(0, keys.length - limit)).map((key) => cache.delete(key)));
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request, SHELL));
  } else if (url.hostname === 'commons.wikimedia.org' || url.pathname.startsWith('/metadata/') || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(networkFirst(request, DATA));
  } else if (url.hostname === 'upload.wikimedia.org' || url.hostname === 'thumb.wikimedia.org') {
    event.respondWith(cacheFirst(request, PHOTOS, MAX_PHOTOS));
  }
  // everything else (music streams) goes straight to the network
});
