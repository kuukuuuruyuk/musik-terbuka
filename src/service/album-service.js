const {nanoid} = require('nanoid');
const InvariantError = require('../exception/invariant-error');
const NotFoundError = require('../exception/not-found-error');

/**
 * Album service
 */
class AlbumService {
  /**
   * Method konstruktor album servis
   * @param {Pool} db db connection pool
   */
  constructor(db) {
    this._db = db;
  }

  /**
   * Store album
   * @params {name, year}
   */
  async storeAlbum({name, year}) {
    const id = nanoid();
    const updatedAt = new Date();
    const queryText = `
    INSERT INTO albums(id, name, year, updated_at)
    VALUES($1, $2, $3, $4)
    RETURNING id
    `;
    const queryValues = [`album-${id}`, name, year, updatedAt];
    const res = await this._db.query(queryText, queryValues);

    if (!res.rows[0].id) throw new InvariantError('Gagal menambahakan album');

    return res.rows[0].id;
  }

  /**
   * Get album by id
   * @param {string} id album id
   * @return {JSON}
   */
  async getAlbumById(id) {
    const queryText = `
    SELECT id,
      name,
      year
    FROM albums
    WHERE id = $1
    `;
    const queryValues = [id];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new NotFoundError('Cannot find album ID!');
    }

    return result.rows[0];
  }

  /**
   * Edit album by id
   * @param {string} id album id
   * @param {any} param1 name and year
   */
  async updateAlbumById(id, {name, year}) {
    const queryText = `
    UPDATE albums
    SET name = $1,
      year = $2,
      updated_at = $3
    WHERE id = $4
    `;
    const updatedAt = new Date();
    const queryValues = [name, year, updatedAt, id];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) throw new NotFoundError('Cannot find album ID!');
  }

  /**
   * Delete album by id
   * @param {any} id album id
   */
  async deleteAlbumById(id) {
    const queryText = 'DELETE FROM albums WHERE id = $1';
    const queryValues = [id];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new NotFoundError('Cannot find album ID!');
    }
  }
}

module.exports = {AlbumService};
