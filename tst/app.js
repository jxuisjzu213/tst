self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;  // إرجاع البيانات من الـ Cache إذا كانت موجودة
            }
            // إذا لم يتم العثور على البيانات في الـ Cache، حاول جلبها من الشبكة
            return fetch(event.request).catch((error) => {
                console.log('Network request failed and no cached data available:', error);
            });
        })
    );
});
