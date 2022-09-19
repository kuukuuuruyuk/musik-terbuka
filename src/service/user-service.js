const {InvariantError} = require('../exception/invariant-error');
const bcrypt = require('bcrypt');
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
   * @param {any} param0 user model
   * @return {string} id user
   */
  async storeUser({
    username,
    password,
    fullname,
  }) {
    await this._isUserExist(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText = `
    INSERT INTO users (id,
      username,
      password,
      fullname
    ) VALUES($1, $2, $3, $4)
    RETURNING id
    `;
    const queryValues = [id, username, hashedPassword, fullname];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rows.length) throw new InvariantError('User gagal ditambahkan');

    return result.rows[0].id;
  }

  /**
   * Check username ready
   * @param {string} username param username from payload
   */
  async _isUserExist(username) {
    const queryText = `
    SELECT username
    FROM users
    WHERE username = $1
    `;
    const queryValues = [username];

    const result = await this._db.query(queryText, queryValues);

    if (result.rows.length > 0) {
      const _message = 'Gagal menambahkan User baru, Username sudah ada';
      throw new InvariantError(_message);
    }
  }

  /**
   * Verifikasi user credential
   * @param {any} username username
   * @param {any} password password
   * @return {any}
   */
  async userCrendential(username, password) {
    const queryText = 'SELECT id, password FROM users WHERE username = $1';
    const queryValues = [username];

    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new AuthenticationError('Username yang anda berikan salah...');
    }

    const {id, password: hashedPassword} = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Password yang anda berikan salah');
    }

    return id;
  }
}

module.exports = {UserService};
