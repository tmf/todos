/**
 * An async CRUD interface for IndexedDB
 * 
 * Supports creation and upgrades of IDBDatabase as well as search and purge by IDBKeyRange
 */
class IndexedDatabase {
	/**
	 * Callback for creating or upgrading IDBDatabase object stores
	 * @callback IndexedDatabase~upgrade
	 * @param {IDBDatabase} db
	 */

	/**
	 * Constructor for an IndexedDatabase
	 * 
	 * @param {Object} options
	 * @param {String} options.name
	 * @param {Number} options.version
	 * @param {IndexedDatabase~upgrade} options.upgrade
	 * 
	 */
	constructor({ name = "db", version = 1, upgrade = () => { } } = {}) {
		this.name = name;
		this.version = version;
		this.upgrade = upgrade;
	}

	/**
	 * Helper function for converting event-based IDBRequests to promises
	 * @async
	 * @param {IDBRequest} request 
	 * @returns Promise<Object>
	 */
	async promisifyIDBRequest(request) {
		return new Promise((resolve, reject) => {
			request.addEventListener("success", () => resolve(request.result));
			request.addEventListener("error", () => reject(null));
		});
	}

	/**
	 * Helper function for opening a connection to an IDBDatabase
	 * 
	 * @async
	 * @returns Promise<IDBDatabase>
	 */
	async connection() {
		const request = indexedDB.open(this.name, this.version);
		request.onupgradeneeded = this.onupgradeneeded.bind(this);
		return this.promisifyIDBRequest(request);
	}

	/**
	 * Callback for upgrading object stores
	 * @param {Event} event 
	 */
	onupgradeneeded(event) {
		const db = event.target.result;

		this.upgrade(db);
	}

	/**
	 * Create an object in an object store
	 * 
	 * @async
	 * @param {String} objectStore 
	 * @param {String} object 
	 * @param {IDBDatabase} connection 
	 * @returns Promise
	 */
	async create(objectStore, object, connection = null) {
		const db = connection || await this.connection();
		const transaction = db.transaction([objectStore], "readwrite");
		const request = transaction.objectStore(objectStore).add(object)
		return this.promisifyIDBRequest(request);
	}

	/**
	 * Read an object by key from an object store
	 * 
	 * @async
	 * @param {String} objectStore 
	 * @param {String} key 
	 * @param {IDBDatabase} connection 
	 * @returns Promise<Object>
	 */
	async read(objectStore, key, connection = null) {
		const db = connection || await this.connection();
		const transaction = db.transaction([objectStore], "readonly");
		const request = transaction.objectStore(objectStore).get(key)
		return this.promisifyIDBRequest(request);
	}

	/**
	 * Update an object from an object store
	 * 
	 * @async
	 * @param {String} objectStore 
	 * @param {Object} object 
	 * @param {IDBDatabase} connection 
	 * @returns Promise
	 */
	async update(objectStore, object, connection = null) {
		const db = connection || await this.connection();
		const transaction = db.transaction([objectStore], "readwrite");
		const request = transaction.objectStore(objectStore).put(object)
		return this.promisifyIDBRequest(request);
	}

	/**
	 * Delete an object by key from an object store
	 * 
	 * @async
	 * @param {String} objectStore 
	 * @param {String} key 
	 * @param {IDBDatabase} connection 
	 * @returns Promise
	 */
	async delete(objectStore, key, connection = null) {
		const db = connection || await this.connection();
		const transaction = db.transaction([objectStore], "readwrite");
		const request = transaction.objectStore(objectStore).delete(key)
		return this.promisifyIDBRequest(request);
	}

	/**
	 * Search an indexed object store with an IDBKeyRange
	 * 
	 * @async
	 * @param {String} objectStore 
	 * @param {String} indexName 
	 * @param {IDBKeyRange} keyRange 
	 * @param {IDBDatabase} connection 
	 * @returns Promise<Array>
	 */
	async search(objectStore, indexName, keyRange, connection = null) {
		// ensure open connection to an IDBDatabase
		const db = connection || await this.connection();

		// prepare transaction
		const transaction = db.transaction([objectStore], "readonly");
		const index = transaction.objectStore(objectStore).index(indexName);
		const request = index.openCursor(keyRange);
		const objects = [];

		// resolve when cursor has traversed all objects
		return new Promise((resolve, reject) => {
			// success handler is called for each result the cursor finds
			request.addEventListener("success", (event) => {
				const cursor = event.target.result;

				if (cursor) {
					// remember object
					objects.push(cursor.value);
					// find next object
					cursor.continue();
				} else {
					// the store has been traversed on the key-ranged index, report found objects
					resolve(objects);
				}
			});
			request.addEventListener("error", (e) => reject(e));
		});
	}

	/**
	 * Purge an indexed object store with an IDBKeyRange and a condition callback for each object
	 * 
	 * @async
	 * @param {String} objectStore 
	 * @param {String} indexName 
	 * @param {IDBKeyRange} keyRange 
	 * @paran {Function} condition
	 * @param {IDBDatabase} connection 
	 * @returns Promise
	 */
	async purge(objectStore, indexName, keyRange, condition = () => true, connection = null) {
		// ensure open connection to an IDBDatabase
		const db = connection || await this.connection();

		// prepare transaction
		const transaction = db.transaction([objectStore], "readwrite");
		const index = transaction.objectStore(objectStore).index(indexName);
		const request = index.openCursor(keyRange);

		// resolve when cursor has traversed all objects
		return new Promise((resolve, reject) => {
			// success handler is called for each result the cursor finds
			request.addEventListener("success", (event) => {
				const cursor = event.target.result;

				if (cursor) {
					// conditionally delete object
					if (condition(cursor.value)) cursor.delete();

					// always advance cursor
					cursor.continue();
				} else {
					// the store has been traversed on the key-ranged index
					resolve();
				}
			});
			request.addEventListener("error", (error) => reject(error));
		});
	}
}
