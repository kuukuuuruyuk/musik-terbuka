const {InvariantError} = require('../exception/invariant-error');

/**
 * Token manager
 */
class TokenManager {
  /**
   * Token manager
   *
   * @param {any} jwt Hapi jwt
   * @param {any} config Configurasi token key
   */
  constructor(jwt, config) {
    this._config = config.token;
    this._jwt = jwt;
  }
  /**
   * Token manager service
   *
   * @param {any} payload Hapi payload
   * @return {string} Access token
   */
  generateAccessToken(payload) {
    const ACCESS_TOKEN_KEY = this._config.accessToken;
    return this._jwt.token.generate(payload, ACCESS_TOKEN_KEY);
  }

  /**
   * Generate refersh token
   *
   * @param {any} payload Hapi payload
   * @return {string} Refresh token
   */
  generateRefreshToken(payload) {
    const REFRESH_TOKEN_KEY = this._config.refreshToken;
    return this._jwt.token.generate(payload, REFRESH_TOKEN_KEY);
  }

  /**
   * Verifikasi access token
   *
   * @param {string} accessToken Access token
   * @return {any} Hapi jwt payload
   */
  verifyAccessToken(accessToken) {
    try {
      const ACCESS_TOKEN_KEY = this._config.accessToken;
      const artifacts = this._jwt.token.decode(accessToken);

      this._jwt.token.verifySignature(artifacts, ACCESS_TOKEN_KEY);

      const payload = artifacts.decoded.payload;
      return payload;
    } catch (error) {
      throw new InvariantError('Access token tidak valid');
    }
  }

  /**
   * Verifikasi refresh token
   *
   * @param {string} refreshToken refresh token
   * @return {any} Hapi jwt payload
   */
  verifyRefreshToken(refreshToken) {
    try {
      const REFRESH_TOKEN_KEY = this._config.refreshToken;
      const artifacts = this._jwt.token.decode(refreshToken);

      this._jwt.token.verifySignature(artifacts, REFRESH_TOKEN_KEY);

      const payload = artifacts.decoded.payload;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
}

module.exports = {TokenManager};
