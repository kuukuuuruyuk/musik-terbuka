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
   * @param {any} payload User model
   * @return {string} User id
   */
  async storeUser(payload) {
    const {username, password, fullname} = payload;

    await this._isUserExist(username);

    const userId = nanoid(16);
    const hashPass = await bcrypt.hash(password, 10);
    const sql = [
      'INSERT INTO',
      'users(id, username, password, fullname)',
      'VALUES($1, $2, $3, $4)',
      'RETURNING id',
    ].join(' ');
    const user =
      await this._db.query(sql, [userId, username, hashPass, fullname]);

    if (!user.rows.length) throw new InvariantError('User gagal ditambahkan');

    return user.rows[0]?.id;
  }

  /**
   * Check username ready
   *
   * @param {string} username Username
   */
  async _isUserExist(username) {
    const sql = [
      'SELECT username',
      'FROM users',
      'WHERE username = $1',
    ].join(' ');
    const user = await this._db.query(sql, [username]);

    if (user.rows.length > 0) {
      const msg = 'Gagal menambahkan User baru, Username sudah ada';
      throw new InvariantError(msg);
    }
  }

  /**
   * Verifikasi user by id
   *
   * @param {string} userId User id
   */
  async verifyExistingUserWithUserId(userId) {
    const sql = 'SELECT id FROM users WHERE id = $1';
    const user = await this._db.query(sql, [userId]);

    if (!user.rowCount) {
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
    const sql = 'SELECT id, password FROM users WHERE username = $1';
    const user = await this._db.query(sql, [username]);

    if (!user.rowCount) {
      throw new AuthenticationError('Username yang anda berikan salah...');
    }

    const {id: userId, password: hashedPassword} = user.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Password yang anda berikan salah');
    }

    return userId;
  }
}

module.exports = {UserService};
