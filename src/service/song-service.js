const {nanoid} = require('nanoid');
const InvariantError = require('../exception/invariant-error');
const NotFoundError = require('../exception/not-found-error');

/**
 * Song service
 */
class SongService {
  /**
   * Method konstruktor album servis
   * @param {any} db db connection pool
   */
  constructor(db) {
    this._db = db;
  }

  /**
   * Add song
   * @param {*} param0 Song params
   * @return {any}
   */
  async storeSong({
    title,
    year,
    performer,
    genre,
    duration,
    albumId,
  }) {
    const updatedAt = new Date();
    const id = nanoid();
    const queryText = `
    INSERT INTO songs(
      id,
      title,
      year,
      performer,
      genre,
      duration,
      album_id,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
    `;
    const queryValues = [
      `song-${id}`,
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
      updatedAt,
    ];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rows[0].id) throw new InvariantError('Failed to add music!');

    return result.rows[0].id;
  }

  /**
   * Get songs
   * @param {*} param0 get sogn params
   * @return {any}
   */
  async getSongs({title, performer}) {
    const querySql = new Set([
      `SELECT id, title, performer`,
      `FROM songs`,
    ]);

    if (title !== undefined) {
      const strQuery = `WHERE LOWER(title) LIKE LOWER('%${title}%')`;
      querySql.add(strQuery);
    }

    if (performer !== undefined) {
      const strQuery = `WHERE LOWER(performer) LIKE LOWER('%${performer}%')`;
      querySql.add(strQuery);
    }

    const itemQuery = [];
    const itemWhere = [];

    for (const item of querySql) {
      const arrQuery = item.split(/\s+/);
      const whereKeyword = ['WHERE'];
      const whereTokenizer = arrQuery.filter(function(token) {
        const tokenizer = token.toUpperCase();
        return tokenizer.length >= 2 && whereKeyword.indexOf(tokenizer) === -1;
      });
      if (arrQuery.indexOf(whereKeyword[0]) !== -1) {
        itemWhere.push(whereTokenizer.join(' '));
      } else {
        itemQuery.push(item);
      }
    }

    let sugarQuery = '';

    if (itemWhere.length) {
      sugarQuery += 'WHERE ';
      sugarQuery += itemWhere.map((item) => item).join(' AND ');
      itemQuery.push(sugarQuery);
    }

    const queryText = itemQuery.join(' ');
    const result = await this._db.query(queryText);

    const songs = result.rows.map((item) => ({
      id: item.id,
      title: item.title,
      performer: item.performer,
    }));

    return songs;
  }

  /**
   * Get song data by id
   * @param {string} id song id
   * @return {any}
   */
  async getSongById(id) {
    const queryText = `
    SELECT
      id,
      title,
      year,
      performer,
      genre,
      duration,
      album_id as albumId
    FROM songs
    WHERE id = $1
    `;
    const queryValues = [id];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) throw new NotFoundError('Not found music ID!');

    const song = result.rows.map((item) => ({
      id: item.id,
      title: item.title,
      year: item.year,
      performer: item.performer,
      genre: item.genre,
      duration: item.duration,
      albumId: item.albumId,
    }))[0];

    return song;
  }

  /**
   * Get song by album id
   * @param {any} albumId Album id
   * @return {any}
   */
  async getSongsByAlbumId(albumId) {
    const queryText = `
    SELECT id, title, performer
    FROM songs
    WHERE album_id = $1
    `;
    const queryValues = [albumId];
    const result = await this._db.query(queryText, queryValues);

    const songs = result.rows.map((item) => ({
      id: item.id,
      title: item.title,
      performer: item.performer,
    }));

    return songs;
  }

  /**
   * Edit song by id
   * @param {string} id song id
   * @param {*} param1 song params
   */
  async updateSongById(id, {
    title, year, performer, genre, duration, albumId,
  }) {
    const queryText = `
    UPDATE songs
    SET title = $1,
      year = $2,
      performer = $3,
      genre = $4,
      duration = $5,
      album_id = $6
    WHERE id = $7
    RETURNING id
    `;
    const queryValues = [title, year, performer, genre, duration, albumId, id];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to update music, ID not found!');
    }
  }

  /**
   * Delete song by id
   * @param {string} id song id
   */
  async deleteSongById(id) {
    const queryText = 'DELETE FROM songs WHERE id = $1 RETURNING id';
    const queryValues = [id];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to delete a music, ID not found!');
    }
  }
}

module.exports = {SongService};
