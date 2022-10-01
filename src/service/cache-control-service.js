/**
 * Redis cache control service
 */
class CacheControlService {
  /**
   * Cache control service
   *
   * @param {any} service Redis
   */
  constructor(service) {
    this._client = service.redis;
  }

  /**
   * set cahce
   * 1800 detik = 30 menit
   *
   * @param {string} key Set key
   * @param {string} value Set value
   * @param {number} expr Expiration in second
   */
  async set(key, value, expr = 1800) {
    await this._client.set(key, value, {EX: expr});
  }

  /**
   * Get cache
   *
   * @param {string} key Client key
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
   * @param {string} key Client key
   * @return {any} Cache data
   */
  del(key) {
    return this._client.del(key);
  }
}

module.exports = {CacheControlService};
