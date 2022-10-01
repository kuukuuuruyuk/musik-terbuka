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
   * @param {any} service Album service
   */
  constructor(db, service) {
    this._db = db;
    this._service = service;
  }

  /**
   * Create album
   *
   * @param {string} name Album model
   * @param {number} year Album year
   */
  async storeAlbum(name = '', year = 0) {
    const albumId = nanoid(16);
    const sql =
      'INSERT INTO albums(id, name, year) VALUES($1, $2, $3) RETURNING id';
    const album = await this._db.query(sql, [albumId, name, year]);

    if (!album.rows[0]?.id) {
      throw new InvariantError('Gagal menambahakan album');
    }

    await this._service.cacheControlService.del('albums');

    return album.rows[0]?.id;
  }

  /**
   * Show album by id
   *
   * @param {string} albumId Album id
   * @return {any} Album
   */
  async getAlbumById(albumId) {
    const sql =
      'SELECT id, name, year, cover FROM albums WHERE id=$1';
    const albums = await this._db.query(sql, [albumId]);

    if (!albums.rowCount) {
      throw new NotFoundError('Cannot find album ID!');
    }

    return albums.rows.map((item) => ({
      id: item.id,
      name: item.name,
      year: item.year,
      coverUrl: item.cover ?
        this._service.uploadService.coverUrl(item.cover) :
        null,
    }))[0];
  }

  /**
   * Show album by id
   *
   * @param {string} albumId Album id
   * @return {any} Album
   */
  async getAlbumByIdWithoutMap(albumId) {
    const sql =
      'SELECT id, name, year, cover FROM albums WHERE id=$1';
    const album = await this._db.query(sql, [albumId]);

    if (!album.rowCount) {
      throw new NotFoundError('Cannot find album ID!');
    }

    return album.rows[0];
  }

  /**
   * Edit album by id
   *
   * @param {string} albumId Album id
   * @param {any} param1 Album model
   */
  async updateAlbumById(albumId, {name, year}) {
    const sql = 'UPDATE albums SET name=$1, year=$2 WHERE id=$3';
    const albums = await this._db.query(sql, [name, year, albumId]);

    if (!albums.rowCount) throw new NotFoundError('Cannot find album ID!');

    await this._service.cacheControlService.del('albums');
  }

  /**
   * Delete album by id
   *
   * @param {string} albumId Album id
   */
  async deleteAlbumById(albumId) {
    const album =
      await this.getAlbumByIdWithoutMap(albumId);
    const sql = 'DELETE FROM albums WHERE id=$1';
    const hapusAlbum = await this._db.query(sql, [albumId]);

    if (!hapusAlbum.rowCount) {
      throw new NotFoundError('Cannot find album ID!' + hapusAlbum.rowCount);
    }

    const cover = album?.cover;
    if (cover) {
      this._service.uploadService.unlinkCover(cover);
    }

    await this._service.cacheControlService.del('albums');
  }

  /**
   * Show all album
   *
   * @return {any} Album model
   */
  async findAllAlbum() {
    try {
      const albums = await this._service.cacheControlService.get('albums');

      return JSON.parse(albums);
    } catch (_error) {
      const albums = await this._db.query('SELECT * FROM albums');

      await this._service.cacheControlService.set(
          'albums',
          JSON.stringify(albums.rows),
      );

      return albums.rows;
    }
  }

  /**
   * Get album data with song id
   *
   * @param {string} albumId Song id
   * @return {any} Album model
   */
  async getAlbumByIdWithSongs(albumId) {
    const sql = [
      'SELECT songs.id, songs.title, songs.performer',
      'FROM albums',
      'INNER JOIN songs ON songs.album_id=albums.id',
      'WHERE albums.id=$1',
    ].join(' ');
    const albums = await this._db.query(sql, [albumId]);

    return albums.rows;
  }

  /**
   * Update album cover by album id
   *
   * @param {string} albumId Album id
   * @param {string} filename Filename for cover
   */
  async editAlbumCoverById(albumId, filename) {
    const updatedAt = new Date().toISOString();
    const sql = 'UPDATE albums SET cover=$1, updated_at=$3 WHERE id=$2';
    const album = await this._db.query(sql, [filename, albumId, updatedAt]);

    if (!album.rowCount) {
      throw new NotFoundError('Cannot find album ID!');
    }
  }

  /**
   * Cek album jika tersedia
   *
   * @param {string} albumId Album id
   */
  async _verifyExistAlbumById(albumId) {
    const sql = 'SELECT id FROM albums WHERE id=$1';
    const album = await this._db.query(sql, [albumId]);

    if (!album.rowCount) {
      throw new NotFoundError('Album ID not found!');
    }
  }

  /**
   * Verifikasi ketersediaan album like status
   *
   * @param {string} albumId Album id
   * @param {string} userId User id
   * @return {any} Album model
   */
  async verifyExistAlbumLikeStatusById(albumId, userId) {
    await this._verifyExistAlbumById(albumId);

    const sql =
      'SELECT * FROM user_album_likes WHERE album_id=$1 AND user_id=$2';
    const album = await this._db.query(sql, [albumId, userId]);

    return album.rowCount;
  }

  /**
   * Hapus like status album
   *
   * @param {string} albumId Album id
   * @param {string} userId User id
   */
  async deleteAlbumLikeStatusById(albumId, userId) {
    const sql = 'DELETE FROM user_album_likes WHERE album_id=$1 AND user_id=$2';
    const album = await this._db.query(sql, [albumId, userId]);

    if (!album.rowCount) {
      throw new NotFoundError('Cannot find album & user ID!');
    }

    await this._service.cacheControlService.del(`album:like:${albumId}`);
  }

  /**
   * Menambahakn album
   *
   * @param {string} albumId Album id
   * @param {string} userId User id
   */
  async addAlbumLikeStatus(albumId, userId) {
    const albumLikeId = nanoid(16);
    const sql = 'INSERT INTO user_album_likes VALUES ($1, $2, $3)';
    const likes = await this._db.query(sql, [albumLikeId, userId, albumId]);

    if (!likes.rowCount) {
      throw new InvariantError('Cannot like album ID!');
    }

    await this._service.cacheControlService.del(`album:like:${albumId}`);
  }

  /**
   * Show album like count by album
   *
   * @param {string} albumId Album id
   * @return {any} Album model
   */
  async getAlbumLikesCountByAlbumId(albumId) {
    try {
      const likes =
        await this._service.cacheControlService.get(`album:like:${albumId}`);

      return {
        count: JSON.parse(likes),
        cache: true,
      };
    } catch {
      const sql = 'SELECT user_id FROM user_album_likes WHERE album_id=$1';
      const likes = await this._db.query(sql, [albumId]);

      if (!likes.rowCount) {
        throw new NotFoundError('Cannot find album ID!');
      }

      await this._service.cacheControlService.set(
          `album:like:${albumId}`,
          JSON.stringify(likes.rowCount),
      );

      return {
        count: likes.rowCount,
        cache: false,
      };
    }
  }
}

module.exports = {AlbumService};
