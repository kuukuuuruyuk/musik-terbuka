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
    const querySql =
      'INSERT INTO albums(id, name, year) VALUES($1, $2, $3) RETURNING id';
    const album = await this._db.query(querySql, [albumId, name, year]);

    if (album.rows[0].id) throw new InvariantError('Gagal menambahakan album');

    await this._service.cacheControlService.del('albums');

    return album.rows[0].id;
  }

  /**
   * Show album by id
   *
   * @param {string} albumId Album id
   * @return {any} Album
   */
  async getAlbumById(albumId) {
    const querySql = 'SELECT id, name, year FROM albums WHERE id = $1';
    const result = await this._db.query(querySql, [albumId]);

    if (!result.rowCount) {
      throw new NotFoundError('Cannot find album ID!');
    }

    return result.rows[0];
  }

  /**
   * Edit album by id
   *
   * @param {string} albumId Album id
   * @param {any} param1 Album model
   */
  async updateAlbumById(albumId, {name, year}) {
    const querySql = 'UPDATE albums SET name = $1, year = $2 WHERE id = $3';
    const result = await this._db.query(querySql, [name, year, albumId]);

    if (!result.rowCount) throw new NotFoundError('Cannot find album ID!');

    await this._service.cacheControlService.del('albums');
  }

  /**
   * Delete album by id
   *
   * @param {string} id Album id
   */
  async deleteAlbumById(id) {
    const album = await this.getAlbumById(id);
    const albumId = album?.id;
    const querySql = 'DELETE FROM albums WHERE id = $1';
    const hapusAlbum = await this._db.query(querySql, [albumId]);

    if (!hapusAlbum.rowCount) {
      throw new NotFoundError('Cannot find album ID!');
    }

    if (album?.cover) {
      const folder = this._service.uploadService.uploadDir();
      fs.unlink(`${folder}/${album?.cover}`);
    }

    await this.cacheControlService.del('albums');
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
    const querySql = [
      'SELECT songs.id, songs.title, songs.performer',
      'FROM albums',
      'INNER JOIN songs ON songs.album_id = albums.id',
      'WHERE albums.id = $1',
    ].join(' ');
    const albums = await this._db.query(querySql, [albumId]);

    return albums.rows;
  }

  /**
   * Update album cover by album id
   *
   * @param {string} albumId Album id
   * @param {string} filename Filename for cover
   */
  async editAlbumCoverById(albumId, filename) {
    const queryText = 'UPDATE albums SET cover = $1 WHERE id = $2';
    const album = await this._db.query(queryText, [filename, albumId]);

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
    const queryText = 'SELECT id FROM albums WHERE id = $1';
    const album = await this._db.query(queryText, [albumId]);

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

    const queryText =
      'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2';
    const album = await this._db.query(queryText, [albumId, userId]);

    return album.rowCount;
  }

  /**
   * Hapus like status album
   *
   * @param {string} albumId Album id
   * @param {string} userId User id
   */
  async deleteAlbumLikeStatusById(albumId, userId) {
    const queryText =
      'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2';
    const album = await this._db.query(queryText, [albumId, userId]);

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
    const queryText =
      'INSERT INTO user_album_likes VALUES ($1, $2, $3)';
    const albumLikes = await this._db.query(queryText, [
      albumLikeId,
      userId,
      albumId,
    ]);

    if (!albumLikes.rowCount) {
      throw new InvariantError('Cannot like album ID!');
    }

    await this._cacheControl.del(`album:like:${albumId}`);
  }

  /**
   * Show album like count by album
   *
   * @param {string} albumId Album id
   * @return {any} Album model
   */
  async getAlbumLikesCountByAlbumId(albumId) {
    try {
      const likeCounts =
        await this._service.cacheControlService.get(`album:like:${albumId}`);

      return {
        count: JSON.parse(likeCounts),
        isCache: true,
      };
    } catch {
      const queryText =
        'SELECT user_id FROM user_album_likes WHERE album_id = $1';
      const albumLikes = await this._db.query(queryText, [albumId]);

      if (!albumLikes.rowCount) {
        throw new NotFoundError('Cannot find album ID!');
      }

      await this._service.cacheControlService.set(
          `album:like:${albumId}`,
          JSON.stringify(albumLikes.rowCount),
      );

      return {
        count: albumLikes.rowCount,
        isCache: false,
      };
    }
  }

  /**
   * Upload cover file
   *
   * @param {any} file File stream
   * @return {Promise} File stream
   */
  async uploadCover(file) {
    const uploadFolder = this._service.uploadService.uploadDir();
    const filename = `${nanoid(12)}${file.hapi.filename}`;
    const directory = `${uploadFolder}/${filename}`;
    const fileStream = fs.createWriteStream(directory);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = {AlbumService};
