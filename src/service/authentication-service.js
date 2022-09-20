/**
 * Authentication service
 */
class AuthenticationService {
  /**
   * Authentication service
   * @param {any} db Database poll connection
   */
  constructor(db) {
    this._db = db;
  }

  /**
   * Create access token
   * @param {any} param0 Store token param
   */
  async storeToken({userId, accessToken, refershToken}) {
    const queryText = `
    INSERT INTO authentications(id,
      access_token,
      refresh_token,
      user_id
    ) VALUES ($1, $2, $3, $4)
    `;
    const queryValues = [accessToken, refershToken, userId];
    await this._db.query(queryText, queryValues);
  }

  /**
   * Chck access token by token
   * @param {string} accessToken Access token string
   */
  async verifyToken(accessToken) {
    const queryText = `
    SELECT access_token, refresh_token
    FROM authentications
    WHERE token = $1
    `;
    const queryValues = [accessToken];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid...');
    }
  }

  /**
   * Delte token by access token
   * @param {string} accessToken Access token
   */
  async deleteToken(accessToken) {
    const queryText = 'DELETE FROM authentications WHERE token = $1';
    const queryValues = [accessToken];
    await this._db.query(queryText, queryValues);
  }
}

module.exports = {AuthenticationService};
