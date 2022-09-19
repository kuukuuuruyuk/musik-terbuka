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
   * @param {string} accessToken Generate refresh token
   */
  async storeToken(accessToken) {
    const queryText = 'INSERT INTO authentications VALUES ($1)';
    const queryValues = [accessToken];
    await this._db.query(queryText, queryValues);
  }

  /**
   * Chck access token by token
   * @param {string} accessToken Access token string
   */
  async verifyToken(accessToken) {
    const queryText = 'SELECT token FROM authentications WHERE token = $1';
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
