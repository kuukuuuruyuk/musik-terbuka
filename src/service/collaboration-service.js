const {nanoid} = require('nanoid');
const {InvariantError} = require('../exception/invariant-error');

/**
 * Collaboration
 */
class CollaborationService {
  /**
   * Collaboration service
   *
   * @param {Pool} db Database connection
   * @param {any} service Collaboration service
   */
  constructor(db, service) {
    this._db = db;
    this._service = service;
  }

  /**
   * Create collaboration
   *
   * @param {string} playlistId playlist id
   * @param {string} userId User id
   * @return {any}
   */
  async storeCollaboration(playlistId, userId) {
    const collabId = nanoid(16);
    const querySql = [
      'INSERT INTO collaborations(id, playlist_id, user_id)',
      'VALUES ($1, $2, $3)',
      'RETURNING id',
    ].join(' ');
    const collabs =
      await this._db.query(querySql, [collabId, playlistId, userId]);

    if (!collabs.rowCount) {
      throw new InvariantError('Gagal menambahkan kolaborasi');
    }

    await this._service.cacheControlService.del(`playlists`);

    return collabs.rows[0].id;
  }

  /**
   * Hapus data collaboration
   *
   * @param {string} playlistId Playlist id
   * @param {string} userId User id
   */
  async deleteCollaboration(playlistId, userId) {
    const queryText =
      'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2';
    const collabs =
      await this._db.query(queryText, [playlistId, userId]);

    if (!collabs.rowCount) {
      throw new InvariantError('Gagal menghapus kolaborasi');
    }

    await this._service.cacheControlService.del(`playlists`);
  }

  /**
   * Verifikasi collaborator
   *
   * @param {string} playlistId Playlist id
   * @param {string} userId User id
   */
  async verifyCollaborator(playlistId, userId) {
    const queryText = [
      'SELECT id, playlist_id, user_id',
      'FROM collaborations',
      'WHERE playlist_id = $1 AND user_id = $2',
    ].join(' ');
    const collabs =
      await this._db.query(queryText, [playlistId, userId]);

    if (!collabs.rowCount) {
      throw new InvariantError('Gagal memverifikasi kolaborasi');
    }
  }
}

module.exports = {CollaborationService};
