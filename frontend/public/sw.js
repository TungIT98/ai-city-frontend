/**
 * Service Worker - PWA Offline Support v3 (Phase 7)
 * Advanced caching strategies for better offline support and performance
 * Part of Phase 7: Performance Deep Optimization (AIC-704)
 */
const CACHE_NAME = 'aicity-v5';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Stale-while-revalidate: serve cached immediately, update in background
const STALE_REVALIDATE = [
  '/api/analytics/',
  '/api/leads/',
];

// Cache-first for immutable assets
const CACHE_FIRST_PATTERNS = /\.(js|css|png|jpg|jpeg|svg|ico|woff2?|ttf|eot)$/;

// Network-first for dynamic pages
const NETWORK_FIRST_PATTERNS = /\/(dashboard|leads|analytics|reports|agents|settings|forecasting|notifications)/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (!url.origin.includes(self.location.origin)) return;

  // API requests - network only, no caching
  if (url.pathname.startsWith('/api')) {
    return;
  }

  // Cache-first for immutable static assets
  if (CACHE_FIRST_PATTERNS.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for analytics/leads pages
  if (STALE_REVALIDATE.some(p => url.pathname.startsWith(p))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Network-first for app pages (fallback to cached shell)
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match('/index.html');
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: { url: data.url || '/' },
      actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (e) {
    console.warn('Push notification parse error:', e);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-leads') {
    event.waitUntil(syncLeads());
  }
});

async function syncLeads() {
  const db = await openDB();
  const tx = db.transaction('syncQueue', 'readwrite');
  const store = tx.objectStore('syncQueue');
  const items = await store.getAll();

  for (const item of items) {
    try {
      await fetch(item.url, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.data),
      });
      store.delete(item.id);
    } catch (e) {
      console.error('Sync failed:', e);
    }
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('aicity-sync', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}
