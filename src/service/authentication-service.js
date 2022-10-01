const {nanoid} = require('nanoid');
const {InvariantError} = require('../exception/invariant-error');

/**
 * Authentication
 */
class AuthenticationService {
  /**
   * Authentication service
   *
   * @param {Pool} db Database connection
   */
  constructor(db) {
    this._db = db;
  }

  /**
   * Create access token
   *
   * @param {any} param0 Token param
   */
  async storeToken({userId, accessToken, refreshToken}) {
    const authId = nanoid(16);
    const sql = [
      'INSERT INTO authentications(id, access_token, refresh_token, user_id)',
      'VALUES ($1, $2, $3, $4)',
    ].join(' ');

    await this._db.query(sql, [
      authId,
      accessToken,
      refreshToken,
      userId,
    ]);
  }

  /**
   * Chck access token by token
   *
   * @param {string} accessToken Access token string
   */
  async verifyAccessToken(accessToken) {
    const sql = [
      'SELECT id, access_token, refresh_token, user_id',
      'FROM authentications',
      'WHERE access_token=$1',
    ].join(' ');
    const auth = await this._db.query(sql, [accessToken]);

    if (!auth.rowCount) {
      throw new InvariantError('Access token tidak valid...');
    }
  }

  /**
   * Chck refresh token by refresh token
   *
   * @param {string} refreshToken Access token string
   */
  async verifyRefreshToken(refreshToken) {
    const sql = [
      'SELECT id, access_token, refresh_token, user_id',
      'FROM authentications',
      'WHERE refresh_token=$1',
    ].join(' ');
    const auth = await this._db.query(sql, [refreshToken]);

    if (!auth.rowCount) {
      throw new InvariantError('Refresh token tidak valid...');
    }
  }

  /**
   * Delete token by refresh token
   *
   * @param {string} refreshToken Access token
   */
  async deleteRefreshToken(refreshToken) {
    const sql = 'DELETE FROM authentications WHERE refresh_token=$1';

    await this._db.query(sql, [refreshToken]);
  }
}

module.exports = {AuthenticationService};
