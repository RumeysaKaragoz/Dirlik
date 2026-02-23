const CACHE_NAME = "deprem-yardim-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/firstaid.html",
  "/style.css",
  "/script.js",
   "/audio.js",
  "/audio/kanama.mp3",
  "/audio/enkaz.mp3",
  "/audio/bilinc.mp3"
];



self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});