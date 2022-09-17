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
}

module.exports = {AuthenticationService};
