/**
 * Redis cache control service
 */
class CacheControlService {
  /**
   * Cache control service
   * @param {any} redis Redis
   */
  constructor(redis) {
    this._client = redis.client;
  }

  /**
   * set cahce
   *
   * @param {any} key Set key
   * @param {any} value Set value
   * @param {any} expirationInSecond Expiration in second
   */
  async set(key, value, expirationInSecond = 1800) { // 1800 detik = 30 menit
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  /**
   * Get cache
   *
   * @param {any} key Client key
   * @return {any} Client data
   */
  async get(key) {
    const cache = await this._client.get(key);

    if (cache === null) throw new Error('Cache tidak ditemukan');

    return cache;
  }

  /**
   * Delete cache by key
   *
   * @param {any} key Client key
   * @return {any} Cache data
   */
  del(key) {
    return this._client.del(key);
  }
}

module.exports = {CacheControlService};
