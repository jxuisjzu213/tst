const CACHE_NAME = 'offline-cache-v1';

// قائمة بالملفات التي سيتم تخزينها في الـ Cache
const urlsToCache = [
    '/',
    'tst/index.html',
    'tst/styles.css',
    'tst/app.js'
];

// أثناء تثبيت الـ Service Worker، نقوم بتخزين الملفات في الـ Cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Caching files');
            return cache.addAll(urlsToCache); // إضافة الملفات المحددة في urlsToCache
        })
        .catch((error) => {
            console.log('Error caching files during install:', error); // التعامل مع الأخطاء
        })
    );
});

// أثناء استلام طلبات من المتصفح، إذا كان المستخدم غير متصل بالإنترنت، يتم تقديم الملفات من الـ Cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse; // إذا كان الملف موجودًا في الـ Cache، قم بإرجاعه
            }
            return fetch(event.request); // إذا كان المتصفح متصلاً بالإنترنت، قم بالبحث عن الملف عبر الإنترنت
        })
        .catch((error) => {
            console.log('Error during fetch event:', error); // التعامل مع الأخطاء
        })
    );
});
