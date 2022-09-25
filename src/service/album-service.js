const {nanoid} = require('nanoid');
const {InvariantError} = require('../exception/invariant-error');
const {NotFoundError} = require('../exception/not-found-error');

/**
 * Album
 */
class AlbumService {
  /**
   * Album service
   *
   * @param {Pool} db Db connection
   */
  constructor(db) {
    this._db = db;
  }

  /**
   * Create album
   *
   * @param {any} param0 Album model
   */
  async storeAlbum({name, year}) {
    const albumId = nanoid(16);
    const queryText = `
    INSERT INTO albums(id,
      name,
      year
    ) VALUES($1, $2, $3)
    RETURNING id
    `;
    const queryValues = [albumId, name, year];
    const res = await this._db.query(queryText, queryValues);

    if (!res.rows[0].id) throw new InvariantError('Gagal menambahakan album');

    return res.rows[0].id;
  }

  /**
   * Show album by id
   *
   * @param {string} id Album id
   * @return {any} Album
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
   *
   * @param {string} id Album id
   * @param {any} param1 Album model
   */
  async updateAlbumById(id, {name, year}) {
    const queryText = `
    UPDATE albums
    SET name = $1,
      year = $2
    WHERE id = $3
    `;
    const queryValues = [name, year, id];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) throw new NotFoundError('Cannot find album ID!');
  }

  /**
   * Delete album by id
   *
   * @param {any} id Album id
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
