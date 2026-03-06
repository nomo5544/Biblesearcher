const CACHE_NAME = 'bible-searcher-v1.0410'; // Оновлена версія

const ASSETS = [
  './',
  'index.html',
  'reader.html',
  'reader.js',
  'script.js', 
  'biblemaps.js', // РЕКОМЕНДАЦІЯ: перейменуйте файл на github у нижній регістр
  'app.webmanifest.json',
  'bibleTextUA.json',
  'bibleTextRU.json',
  'bibleTextEN.json',
  'bibleTextPL.json',
  'bibleTextES.json',
  'bibleTextGR.json',
  'icon-192.png',
  'icon-512.png'
];

// 1. Встановлення (М'яке завантаження кожного файлу окремо)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Замість одного addAll робимо індивідуальні запити
      const cachePromises = ASSETS.map(url => {
        return cache.add(url).catch(err => {
          console.warn(`[SW] Не вдалося закешувати ${url}:`, err);
          // Помилка одного файлу тепер не зупиняє процес
        });
      });
      return Promise.all(cachePromises);
    }).then(() => self.skipWaiting())
  );
});

// 2. Активація (очищення старого кешу)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Видалення старого кешу:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Стратегія запитів (Stale-While-Revalidate)
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Оновлюємо кеш тільки при успішній відповіді
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Повідомлення версії
self.addEventListener('message', (event) => {
  if (event.data.action === 'getVersion') {
    event.source.postMessage({ version: CACHE_NAME });
  }
});
