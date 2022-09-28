const Jwt = require('@hapi/jwt');
const {InvariantError} = require('../exception/invariant-error');

/**
 * Token manager
 */
class TokenManager {
  /**
   * Token manager service
   *
   * @param {any} payload Hapi payload
   * @return {string} Access token
   */
  generateAccessToken(payload) {
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  /**
   * Generate refersh token
   *
   * @param {any} payload Hapi payload
   * @return {string} Refresh token
   */
  generateRefreshToken(payload) {
    return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  /**
   * Verifikasi refresh token
   *
   * @param {string} refreshToken refresh token
   * @return {any} Hapi jwt payload
   */
  verifyRefreshToken(refreshToken) {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);

      return artifacts.decoded?.payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
}

module.exports = {TokenManager};
