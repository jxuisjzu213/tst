const CACHE_NAME = 'offline-cache-v1';

// قائمة الملفات التي سيتم تخزينها في الـ Cache
const urlsToCache = [
    'https://jxuisjzu213.github.io/tst/tst/styles.css',
    'https://jxuisjzu213.github.io/tst/tst/index.html',
    'https://jxuisjzu213.github.io/tst/tst/app.js',
    'https://jxuisjzu213.github.io/tst/tst/service-worker.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css'
];

// أثناء تثبيت الـ Service Worker، نقوم بتخزين الملفات في الـ Cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Caching files...');
            return cache.addAll(urlsToCache);
        })
        .catch((error) => {
            console.error('Error caching files during install:', error);
        })
    );
});

// تحديث الـ Cache عند وجود إصدار جديد
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// أثناء استلام طلبات، يتم تقديم الملفات من الـ Cache إذا كان المستخدم غير متصل
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).catch(() => {
                console.warn('Network request failed. Serving fallback content.');
                return new Response('عذرًا، لا يمكنك الوصول إلى هذا المحتوى أثناء عدم الاتصال بالإنترنت.');
            });
        })
    );
});
