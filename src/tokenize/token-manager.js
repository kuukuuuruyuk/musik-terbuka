const Jwt = require('@hapi/jwt');
const {InvariantError} = require('../exception/invariant-error');

/**
 * Token manager
 */
class TokenManager {
  /**
   * Generate access token
   * @param {any} payload request payload
   * @return {any}
   */
  generateAccessToken(payload) {
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  /**
   * Generate refersh token
   * @param {any} payload request payload
   * @return {any}
   */
  generateRefreshToken(payload) {
    return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  /**
   * Verifikasi refresh token
   * @param {string} refreshToken refresh token
   * @return {any}
   */
  verifyRefreshToken(refreshToken) {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const {payload} = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
}

module.exports = {TokenManager};
