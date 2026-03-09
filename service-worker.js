const CACHE_NAME = 'flowlink-v1';
const SHELL_ASSETS = [
    './',
    'index.html',
    'index.tsx',
    'manifest.json',
    'service-worker.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Caching shell assets');
            return cache.addAll(SHELL_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // 1. Special handling for manifest.json to force correct MIME type (Cache-First)
    if (url.pathname.endsWith('manifest.json')) {
        event.respondWith(
            caches.match('manifest.json').then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(response => {
                    const corrected = new Response(response.body, {
                        status: response.status,
                        headers: new Headers({
                            'Content-Type': 'application/manifest+json'
                        })
                    });
                    caches.open(CACHE_NAME).then(cache => 
                        cache.put('manifest.json', corrected.clone())
                    );
                    return corrected;
                });
            })
        );
        return;
    }

    // 2. Navigation fallback for SPA (client-side routing)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('index.html'))
        );
        return;
    }

    // 3. General Cache-First strategy with Network update for other assets
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;
            
            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Cache a clone of the response if it's from our origin
                if (url.origin === self.location.origin && event.request.method === 'GET') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }

                return networkResponse;
            });
        })
    );
});
