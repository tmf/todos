importScripts("./classes/offline-cache.js");

const version = `?v=1`;
const cache = new OfflineCache({
	name: `todos${version}`,
	version,
	urls: [
		`./`,
		`./site.webmanifest${version}`,
		`./images/favicon.ico${version}`,
		`./images/android-chrome-192x192.png${version}`,
		`./images/favicon-512x512.png${version}`,
	],
});

self.addEventListener("activate", (event) =>
	event.waitUntil(cache.activate().then(() => self.clients.claim()))
);
self.addEventListener("install", (event) =>
	event.waitUntil(cache.install().then(() => self.skipWaiting()))
);
self.addEventListener("fetch", (event) =>
	event.respondWith(cache.fetch(event)))
);
