/**
 * A very simple offline cache for service workers
 *
 * Supports pre-caching of specific resources
 */
class OfflineCache {
	/**
	 * Instance constructor
	 *
	 * @param {Object} options 
	 * @param {Array} options.urls an array of URLs to pre-cache during the install phase
	 * @param {String} options.name the name for the OfflineCachem, used as a prefix for the cacheName
	 * @param {String|Number} options.version a version identifier for the cache, used as a suffix for the cacheName
	 * @param {CacheStorage} options.cacheStorage provide your own CacheStorage interface, by default using WindowOrWorkerGlobalScope.caches
	 */
	constructor(options = {}) {
		const { name = "offline", version = 1, urls = [], cacheStorage = caches } = options;
		this.urls = urls;
		this.name = name;
		this.version = version;
		this.cacheName = `${this.name}-${this.version}`;
		this.cacheStorage = cacheStorage;
	}

	/**
	 * Method for the activate phase, typically a ServiceWorker activate event
	 *
	 * Deletes all other caches starting with the `name`, except when it matches the `version`
	 *
	 * https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope/activate_event
	 *
	 * @async
	 * @returns Promise
	 * @example
	 * const cache = new OfflineCache();
	 * self.addEventListener("activate", (event) =>
	 * 	event.waitUntil(cache.activate().then(() => self.clients.claim()));
	 * );
	 */
	async activate() {
		const keys = await this.cacheStorage.keys();
		const toDelete = (keys || []).filter((key) => key.startsWith(this.name) && key !== this.cacheName);
		return Promise.all(toDelete.map((key) => this.cacheStorage.delete(key)));
	}

	/**
	 * Method for the install phase, typically a ServiceWorker install event
	 *
	 * https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope/install_event
	 *
	 * @example
	 * const cache = new OfflineCache({ urls: ['/'] });
	 * self.addEventListener("install", (event) =>
	 * 	event.waitUntil(cache.install().then(() => self.skipWaiting()));
	 * );
	 */
	async install() {
		const cache = await this.cacheStorage.open(this.cacheName);
		if (cache) {
			await cache.addAll(this.urls);
		}
	}

	/**
	 * Event handler for the ServiceWorker FetchEvent
	 *
	 * https://developer.mozilla.org/docs/Web/API/FetchEvent
	 *
	 * @param {FetchEvent} event
	 * @return void|Promise
	 * @example
	 * const cache = new OfflineCache({ urls: ['/'] });
	 * self.addEventListener("fetch", (event) =>
	 * 	event.respondWith(
	 * 		cache.fetch(event).then((response) => response || fetch(event.request))
	 * 	)
	 * );
	 */
	async fetch(event) {
		const cache = await this.cacheStorage.open(this.cacheName);
		
		if (cache) {
			const match = await cache.match(event.request);
			if (match) {
				return match;
			}
		}
		return fetch(event.request);
	}
}
