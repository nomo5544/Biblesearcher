const CACHE_NAME = 'bible-searcher-v1.0135'; // Оновив версію тут
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

// 1. Встановлення
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Активація (очищення старих версій)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Стратегія "Stale-While-Revalidate" (найкраща для таких додатків)
// Видає файл із кешу миттєво, але у фоні йде в мережу, перевіряє оновлення 
// і тихо оновлює кеш для наступного разу.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
    // ignoreSearch: true ігнорує все, що йде після "?" в URL
    // тепер reader.html?ref=... завжди буде братися з кешу як reader.html
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Якщо відповідь від мережі успішна, зберігаємо її копію в кеш
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
            // Якщо мережі немає, ми просто нічого не оновлюємо
        });

        // Повертаємо кеш негайно, якщо він є, інакше чекаємо на мережу
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// 4. Подія для отримання версії
self.addEventListener('message', (event) => {
  if (event.data.action === 'getVersion') {
    event.source.postMessage({
      version: CACHE_NAME
    });
  }
});
