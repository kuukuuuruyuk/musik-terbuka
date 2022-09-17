/**
 * User service
 */
class UserService {
  /**
   * User service constructor
   * @param {any} db db connection pool
   */
  constructor(db) {
    this._db = db;
  }

  /**
   * Simpan user
   */
  storeUser() {}

  /**
   * Check username by username
   */
  isExistUsername() {}

  /**
   * Ambil data user by id
   */
  getUserById() {}

  /**
   * Check kredensial user
   */
  verifyUserCredential() {}
}

module.exports = {UserService};
