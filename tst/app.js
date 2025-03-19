self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((cachedResponse) => {
            // تحقق من أن هناك استجابة من الـ Cache
            if (cachedResponse) {
                return cachedResponse;  // إرجاع البيانات من الـ Cache
            }

            // إذا لم يتم العثور على البيانات في الـ Cache، حاول جلبها من الشبكة
            return fetch(event.request).then((networkResponse) => {
                // تحقق من أن الاستجابة من الشبكة صالحة
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;  // إذا كانت الاستجابة غير صالحة، إرجاعها كما هي
                }

                // إذا كانت الاستجابة صالحة، خزنها في الـ Cache
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });

                return networkResponse;
            }).catch((error) => {
                console.log('Network request failed:', error);  // التعامل مع فشل الشبكة
            });
        })
    );
});
