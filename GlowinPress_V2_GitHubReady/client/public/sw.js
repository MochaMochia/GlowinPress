const CACHE_NAME = 'glowinpress-v1';
const OFFLINE_ENABLED_ROUTES = [
  '/',
  '/image-compressor',
  '/image-converter',
  '/video-converter',
  '/video-compressor',
  '/settings'
];

// These routes require internet connection
const ONLINE_ONLY_ROUTES = [
  '/image-downloader',
  '/video-downloader',
  '/youtube'
];

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/favicon.ico',
  '/site.webmanifest',
  '/error.html',
  '/no-javascript.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests - they need internet
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If online, serve from network and cache
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          }
          throw new Error('Network response was not ok');
        })
        .catch(() => {
          // If offline, check if route is supported offline
          const pathname = url.pathname;
          const isOfflineEnabled = OFFLINE_ENABLED_ROUTES.some(route => 
            pathname === route || (route !== '/' && pathname.startsWith(route))
          );
          
          if (isOfflineEnabled) {
            // Serve cached version or index.html for SPA routing
            return caches.match(request).then((response) => {
              return response || caches.match('/index.html');
            });
          } else {
            // For online-only routes, show offline page
            return new Response(
              `<!DOCTYPE html>
              <html>
              <head>
                <title>Offline - GlowinPress</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { 
                    font-family: system-ui, sans-serif; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    min-height: 100vh; 
                    margin: 0; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  }
                  .container { 
                    text-align: center; 
                    padding: 2rem; 
                    background: white; 
                    border-radius: 1rem; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                  }
                  h1 { color: #8b5cf6; margin-bottom: 1rem; }
                  p { color: #666; line-height: 1.6; }
                  .icon { font-size: 4rem; margin-bottom: 1rem; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="icon">📡</div>
                  <h1>This feature requires internet connection</h1>
                  <p>This tool needs to connect to external services and is not available offline.</p>
                  <p>Please check your connection and try again.</p>
                </div>
              </body>
              </html>`,
              {
                headers: { 'Content-Type': 'text/html' },
                status: 503
              }
            );
          }
        })
    );
    return;
  }

  // Handle other requests (assets, etc.)
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Process any queued offline actions when back online
      processOfflineQueue()
    );
  }
});

async function processOfflineQueue() {
  // Implementation for processing offline queue
  // This would handle any actions that were queued while offline
  console.log('Processing offline queue...');
}
