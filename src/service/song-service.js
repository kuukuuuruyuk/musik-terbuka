const {nanoid} = require('nanoid');
const {InvariantError} = require('../exception/invariant-error');
const {NotFoundError} = require('../exception/not-found-error');

/**
 * Song service
 */
class SongService {
  /**
   * Method konstruktor album servis
   * @param {any} db Database connection pool
   * @param {any} service Song service
   */
  constructor(db, service) {
    this._db = db;
    this._service = service;
  }

  /**
   * Create song
   *
   * @param {any} payload Request payload
   * @return {any} Song model
   */
  async storeSong(payload) {
    const {title, year, performer, genre, duration, albumId} = payload;
    const songId = nanoid(16);
    const queryText = `
    INSERT INTO songs(id,
      title,
      year,
      performer,
      genre,
      duration,
      album_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
    `;
    const result = await this._db.query(queryText, [
      songId,
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    ]);

    if (!result.rows[0].id) throw new InvariantError('Failed to add music!');

    await this._service.cacheControlService.del('songs');

    return result.rows[0].id;
  }

  /**
   * Store song
   *
   * @param {any} title Song title
   * @param {any} performer Song performer
   * @return {any} Song data
   */
  async _getSongs(title='', performer='') {
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
    const songs = result.rows;

    await this._service.cacheControlService.set(
        'songs',
        JSON.stringify(songs),
        (60 * 30),
    );

    return songs;
  }

  /**
   * Store song
   *
   * @param {any} payload Request payload
   * @return {any} Song data
   */
  async getSongs(payload) {
    try {
      const songs = await this._service.cacheControlService.get('songs');
      return JSON.parse(songs);
    } catch (_error) {
      const {title, performer} = payload;
      return await this._getSongs(title, performer);
    }
  }

  /**
   * Show song data by id
   *
   * @param {string} id Song id
   * @return {any} Song model
   */
  async getSongById(id) {
    const queryText = `
    SELECT id,
      title,
      year,
      performer,
      genre,
      duration,
      album_id
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
      albumId: item.album_id,
    }));

    await this._service.cacheControlService.del('songs');

    return song[0];
  }

  /**
   * Show song by album id
   *
   * @param {any} albumId String id
   * @return {any} Song model
   */
  async getSongsByAlbumId(albumId) {
    const queryText = `
    SELECT id,
      title,
      performer
    FROM songs
    WHERE album_id = $1
    `;

    const songs = await this._db.query(queryText, [albumId]);

    await this._service.cacheControlService.set(
        `song:inAlbum:${albumId}`,
        JSON.stringify(songs.rows),
    );


    return songs.rows;
  }

  /**
   * Edit song by id
   *
   * @param {string} songId Song id
   * @param {any} payload Request payload
   */
  async updateSongById(songId, payload) {
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
    const song = await this._db.query(queryText, [
      title = payload.title,
      year = payload.year,
      performer = payload.performer,
      genre = payload.genre,
      duration = payload.duration,
      albumId = payload.albumId,
      songId,
    ]);

    if (!song.rowCount) {
      throw new NotFoundError('Failed to update music, ID not found!');
    }

    await this._service.cacheControlService.del('songs');
  }

  /**
   * Delete song by id
   *
   * @param {string} songId Song id
   */
  async deleteSongById(songId) {
    const queryText = 'DELETE FROM songs WHERE id = $1 RETURNING id';
    const songs = await this._db.query(queryText, [songId]);

    if (!songs.rowCount) {
      throw new NotFoundError('Failed to delete a music, ID not found!');
    }

    await this._service.cacheControlService.del('songs');
  }

  /**
   * Check kebenaran song di tabel
   *
   * @param {string} songId Song id
   */
  async verifyExistingSongById(songId) {
    const queryText = 'SELECT id FROM songs WHERE id = $1';

    const songs = await this._db.query(queryText, [songId]);

    if (!songs.rowCount) {
      throw new NotFoundError('Not found music ID!');
    }
  }
}

module.exports = {SongService};
