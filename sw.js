const CACHE_NAME = 'bible-searcher-v1.03211110';
const ASSETS = [
  'index.html',
  'reader.html',
  'reader.js',
  'app.webmanifest.json', // Додав .json як у вас у переліку
  'bibleTextUA.json',
  'bibleTextRU.json',
  'icon-192.png',
  'icon-512.png'
];

// Встановлення: зберігаємо всі файли в пам'ять пристрою
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Робота: якщо немає інтернету, беремо файли з пам'яті
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
