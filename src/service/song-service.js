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
    const sql = [
      'INSERT INTO',
      'songs(id, title, year, performer, genre, duration, album_id)',
      'VALUES ($1, $2, $3, $4, $5, $6, $7)',
      'RETURNING id',
    ].join(' ');
    const values = [songId, title, year, performer, genre, duration, albumId];
    const song = await this._db.query(sql, values);

    if (!song.rows[0]?.id) throw new InvariantError('Failed to add music!');

    await this._service.cacheControlService.del('songs');

    return song.rows[0]?.id;
  }

  /**
   * Store song
   *
   * @param {string} title Song title
   * @param {string} performer Song performer
   * @return {any} Song data
   */
  async _getSongs(title='', performer='') {
    const sqlQuery = new Set([
      'SELECT id, title, performer',
      'FROM songs',
    ]);

    if (title !== undefined) {
      const whereQuery = `WHERE LOWER(title) LIKE LOWER('%${title}%')`;
      sqlQuery.add(whereQuery);
    }

    if (performer !== undefined) {
      const whereQuery = `WHERE LOWER(performer) LIKE LOWER('%${performer}%')`;
      sqlQuery.add(whereQuery);
    }

    const itemQuery = [];
    const itemWhere = [];

    for (const item of sqlQuery) {
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

    const song = await this._db.query(itemQuery.join(' '));

    await this._service.cacheControlService.set(
        'songs',
        JSON.stringify(song),
        (60 * 30),
    );

    return song;
  }

  /**
   * Store song
   *
   * @param {any} payload Request payload
   * @return {any} Song data
   */
  async getSongs(payload) {
    try {
      const song = await this._service.cacheControlService.get('songs');

      return JSON.parse(song);
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
    const sql = [
      'SELECT id, title, year, performer, genre, duration, album_id',
      'FROM songs',
      'WHERE id = $1',
    ].join(' ');
    const songs = await this._db.query(sql, [id]);

    if (!songs.rowCount) throw new NotFoundError('Not found music ID!');

    const song = songs.rows.map((item) => ({
      id: item.id,
      title: item.title,
      year: item.year,
      performer: item.performer,
      genre: item.genre,
      duration: item.duration,
      albumId: item.album_id,
    }))[0];

    await this._service.cacheControlService.del('songs');

    return song;
  }

  /**
   * Show song by album id
   *
   * @param {any} albumId String id
   * @return {any} Song model
   */
  async getSongsByAlbumId(albumId) {
    const sql = [
      'SELECT id, title, performer',
      'FROM songs',
      'WHERE album_id = $1',
    ].join(' ');
    const song = await this._db.query(sql, [albumId]);

    await this._service.cacheControlService.set(
        `song:inAlbum:${albumId}`,
        JSON.stringify(song.rows),
    );


    return song.rows;
  }

  /**
   * Edit song by id
   *
   * @param {string} songId Song id
   * @param {any} payload Request payload
   */
  async updateSongById(songId, payload) {
    const {title, year, performer, genre, duration, albumId} = payload;
    const sql = [
      'UPDATE songs',
      'SET',
      'title = $1, year = $2,',
      'performer = $3, genre = $4,',
      'duration = $5, album_id = $6',
      'WHERE id = $7',
      'RETURNING id',
    ].join(' ');
    const values = [title, year, performer, genre, duration, albumId, songId];
    const song = await this._db.query(sql, values);

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
    const sql = 'DELETE FROM songs WHERE id = $1 RETURNING id';
    const song = await this._db.query(sql, [songId]);

    if (!song.rowCount) {
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
    const sql = 'SELECT id FROM songs WHERE id = $1';
    const song = await this._db.query(sql, [songId]);

    if (!song.rowCount) {
      throw new NotFoundError('Not found music ID!');
    }
  }
}

module.exports = {SongService};
