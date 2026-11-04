const CACHE_NAME = "pdf-editor-shell-v8";
const APP_SHELL = [
    "./index.html",
    "./config/manifest.json",
    "./src/styles/main.css",
    "./src/styles/builder.css",
    "./src/scripts/main.js",
    "./src/scripts/builder.js",
    "./src/scripts/pwa-install.js",
    "./assets/vendor/fontawesome/css/all.min.css",
    "./assets/vendor/fontawesome/webfonts/fa-brands-400.woff2",
    "./assets/vendor/fontawesome/webfonts/fa-regular-400.woff2",
    "./assets/vendor/fontawesome/webfonts/fa-solid-900.woff2",
    "./assets/vendor/fontawesome/webfonts/fa-v4compatibility.woff2",
    "./assets/vendor/pdfmake/pdfmake.min.js",
    "./assets/vendor/pdfmake/vfs_fonts.js",
    "./assets/icons/favicon.ico",
    "./assets/icons/favicon.svg",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: "reload" }))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName.startsWith("pdf-editor-") && cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const requestUrl = new URL(request.url);

    if (request.method !== "GET" || requestUrl.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        fetch(request, { cache: "no-cache" })
            .then(async (response) => {
                if (response.ok && response.type === "basic") {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, response.clone());
                }
                return response;
            })
            .catch(async () => {
                const cachedResponse = await caches.match(request);
                if (cachedResponse) {
                    return cachedResponse;
                }

                if (request.mode === "navigate") {
                    const appShellResponse = await caches.match("./index.html");
                    if (appShellResponse) {
                        return appShellResponse;
                    }
                }

                return Response.error();
            })
    );
});
