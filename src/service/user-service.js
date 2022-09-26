const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');
const {InvariantError} = require('../exception/invariant-error');
const {AuthenticationError} = require('../exception/authentication-error');
const {NotFoundError} = require('../exception/not-found-error');

/**
 * User
 */
class UserService {
  /**
   * User service
   * @param {any} db Database connection
   */
  constructor(db) {
    this._db = db;
  }

  /**
   * Create user
   *
   * @param {any} param0 User params
   * @return {string} User id
   */
  async storeUser({
    username,
    password,
    fullname,
  }) {
    await this._isUserExist(username);

    const userId = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText = `
    INSERT INTO users (id,
      username,
      password,
      fullname
    ) VALUES($1, $2, $3, $4)
    RETURNING id
    `;
    const users = await this._db.query(queryText, [
      userId,
      username,
      hashedPassword,
      fullname,
    ]);

    if (!users.rows.length) throw new InvariantError('User gagal ditambahkan');

    return users.rows[0].id;
  }

  /**
   * Check username ready
   *
   * @param {string} username Username
   */
  async _isUserExist(username) {
    const queryText = `
    SELECT username
    FROM users
    WHERE username = $1
    `;

    const users = await this._db.query(queryText, [username]);

    if (users.rows.length > 0) {
      const _message = 'Gagal menambahkan User baru, Username sudah ada';
      throw new InvariantError(_message);
    }
  }

  /**
   * Verifikasi user by id
   *
   * @param {string} userId User id
   */
  async verifyExistingUserWithUserId(userId) {
    const queryText = 'SELECT id FROM users WHERE id = $1';

    const result = await this._db.query(queryText, [userId]);

    if (!result.rowCount) {
      throw new NotFoundError('Not found music ID!');
    }
  }

  /**
   * Verifikasi user credential
   *
   * @param {string} username username
   * @param {string} password password
   * @return {string} User id
   */
  async userCrendential(username, password) {
    const queryText = 'SELECT id, password FROM users WHERE username = $1';
    const users = await this._db.query(queryText, [username]);

    if (!users.rowCount) {
      throw new AuthenticationError('Username yang anda berikan salah...');
    }

    const {id: userId, password: hashedPassword} = users.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Password yang anda berikan salah');
    }

    return userId;
  }
}

module.exports = {UserService};
