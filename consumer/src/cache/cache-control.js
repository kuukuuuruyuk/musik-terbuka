/**
 * Redis cache control
 */
class CacheControl {
  /**
   * Cache redis control
   *
   * @param {any} service Cache service
   */
  constructor(service) {
    this._client = service.redis;
  }

  /**
   * Set redis cache
   *
   * @param {string} key Key cache
   * @param {string} value Value cache
   * @param {number} expInSec Expire
   */
  async set(key, value, expInSec = 900) {
    await this._client.set(key, value, {
      EX: expInSec,
    });
  }

  /**
   * Get redis cache by key
   *
   * @param {string} key Cache key
   */
  async get(key) {
    const result = await this._client.get(key);
    if (!result) throw new Error('Cache not found');
  }

  /**
   * Hapus cache data
   *
   * @param {string} key Cache redis key
   * @return {any} Cache data
   */
  del(key) {
    return this._client.del(key);
  }
}

module.exports = {CacheControl};
