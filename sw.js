const CACHE_NAME = 'bible-searcher-v1.032';
const ASSETS = [
  'index.html',
  'reader.html',
  'reader.js',
  'app.webmanifest.json',
  'bibleTextUA.json',
  'bibleTextRU.json',
  'icon-192.png',
  'icon-512.png'
];

// 1. Встановлення: кешуємо файли та змушуємо новий SW активуватися негайно
self.addEventListener('install', (event) => {
  console.log(`[Service Worker] Встановлення версії: ${CACHE_NAME}`);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => {
      // skipWaiting() дозволяє новому SW стати активним, не чекаючи закриття вкладок
      return self.skipWaiting();
    })
  );
});

// 2. Активація: очищаємо старий кеш та беремо керування сторінками на себе
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log(`[Service Worker] Видалення старого кешу: ${cache}`);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // Змушує SW негайно почати контролювати всі відкриті вкладки
      return self.clients.claim();
    })
  );
});

// 3. Обробка запитів: спочатку кеш, потім мережа
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Повертаємо з кешу, якщо є
      }
      return fetch(event.request); // Або йдемо в інтернет
    })
  );
});

// 4. Подія для отримання версії (щоб ви могли вивести її в консоль браузера)
self.addEventListener('message', (event) => {
  if (event.data.action === 'getVersion') {
    event.source.postMessage({
      version: CACHE_NAME
    });
  }
});
