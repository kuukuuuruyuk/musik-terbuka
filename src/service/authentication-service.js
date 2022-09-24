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
   * @param {any} param0 Store token param
   */
  async storeToken({userId, accessToken, refershToken}) {
    const id = `auth-${nanoid(16)}`;
    const queryText = `
    INSERT INTO authentications(id,
      access_token,
      refresh_token,
      user_id
    ) VALUES ($1, $2, $3, $4)
    `;
    const queryValues = [id, accessToken, refershToken, userId];
    await this._db.query(queryText, queryValues);
  }

  /**
   * Chck access token by token
   *
   * @param {string} accessToken Access token string
   */
  async verifyToken(accessToken) {
    const queryText = `
    SELECT id,
      access_token,
      refresh_token,
      user_id
    FROM authentications
    WHERE access_token = $1
    `;
    const queryValues = [accessToken];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid...');
    }
  }

  /**
   * Delete token by access token
   *
   * @param {string} accessToken Access token
   */
  async deleteToken(accessToken) {
    const queryText = 'DELETE FROM authentications WHERE access_token = $1';
    const queryValues = [accessToken];

    await this._db.query(queryText, queryValues);
  }
}

module.exports = {AuthenticationService};
