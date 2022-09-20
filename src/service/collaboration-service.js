const {InvariantError} = require('../exception/invariant-error');

/**
 * Collaboration service
 */
class CollaborationService {
  /**
   * Collaboration service
   * @param {any} db Db pool
   */
  constructor(db) {
    this._db = db;
  }

  /**
   * Create collaboration
   * @param {any} playlistId playlist id
   * @param {string} userId user id
   * @return {any}
   */
  async storeCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;
    const queryText = `
    INSERT INTO collaborations
    VALUES ($1, $2, $3)
    RETURNING id
    `;
    const queryValues = [id, playlistId, userId];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan kolaborasi');
    }

    return result.rows[0].id;
  }

  /**
   * Hapus data collaboiration
   * @param {string} playlistId playlist id
   * @param {string} userId user id
   */
  async deleteCollaboration(playlistId, userId) {
    const queryText = `
    DELETE FROM collaborations
    WHERE playlist_id = $1 AND user_id = $2
    `;
    const queryValues = [playlistId, userId];
    const result = await this._pool.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus kolaborasi');
    }
  }

  /**
   * Verifikasi collaborator
   * @param {string} playlistId Playlist id
   * @param {string} userId user id
   */
  async verifyCollaborator(playlistId, userId) {
    const queryText = `
    SELECT *
    FROM collaborations
    WHERE playlist_id = $1 AND user_id = $2
    `;
    const queryValues = [playlistId, userId];
    const result = await this._pool.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new InvariantError('Gagal memverifikasi kolaborasi');
    }
  }
}

module.exports = {CollaborationService};
