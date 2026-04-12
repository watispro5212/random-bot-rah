/**
 * Nexus Protocol v12.0.0 — In-Memory TTL Cache
 * Reduces MongoDB load by caching frequently-accessed documents (e.g., GuildConfig).
 * 5-minute TTL with manual invalidation support.
 */

class Cache {
    constructor(ttl = 5 * 60 * 1000) {
        this.store = new Map();
        this.ttl = ttl;
    }

    /**
     * Retrieve a value from cache
     * @param {string} key
     * @returns {*} Cached value or null if expired/missing
     */
    get(key) {
        const entry = this.store.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }

        return entry.value;
    }

    /**
     * Store a value in cache with TTL
     * @param {string} key
     * @param {*} value
     * @param {number} [customTtl] - Override default TTL in ms
     */
    set(key, value, customTtl) {
        this.store.set(key, {
            value,
            expiresAt: Date.now() + (customTtl || this.ttl)
        });
    }

    /**
     * Invalidate a specific key
     * @param {string} key
     */
    invalidate(key) {
        this.store.delete(key);
    }

    /**
     * Invalidate all keys matching a prefix
     * @param {string} prefix
     */
    invalidatePrefix(prefix) {
        for (const key of this.store.keys()) {
            if (key.startsWith(prefix)) {
                this.store.delete(key);
            }
        }
    }

    /** Clear the entire cache */
    flush() {
        this.store.clear();
    }

    /** Get current cache size */
    get size() {
        return this.store.size;
    }
}

// Singleton instances for different cache domains
const guildConfigCache = new Cache(5 * 60 * 1000);  // 5 min
const cooldownCache = new Cache(60 * 1000);          // 1 min

module.exports = { Cache, guildConfigCache, cooldownCache };
