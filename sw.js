const CACHE_NAME = "utilhub-v10-nova-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",
  "./sw.js"
];

/* INSTALACIÓN */

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        return self.skipWaiting();
      })

  );

});

/* ACTIVACIÓN */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()
      .then(keys => {

        return Promise.all(

          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))

        );

      })
      .then(() => {
        return self.clients.claim();
      })

  );

});

/* PETICIONES */

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(

    caches.match(event.request)
      .then(cachedResponse => {

        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {

            if (
              !response ||
              response.status !== 200 ||
              response.type === "opaque"
            ) {
              return response;
            }

            const copy =
              response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(
                  event.request,
                  copy
                );
              });

            return response;

          })
          .catch(() => {

            return caches.match(
              "./index.html"
            );

          });

      })

  );

});
