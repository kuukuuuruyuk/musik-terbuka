const {NotFoundError} = require('./exception/not-found-error');

/**
 * Playlist service
 */
class PlayistsService {
  /**
   * Playlist Service
   *
   * @param {any} db Database pool
   * @param {any} service Playlist service
   */
  constructor(db, service) {
    this._pool = db;
    this._cacheControl = service.cacheControl;
  }

  /**
   * Get playlist data
   *
   * @param {string} playlistId Playlist id
   * @return {any} Playlist model
   */
  async getPlaylistById(playlistId) {
    const sql = 'SELECT id, name FROM playlists WHERE id=$1';
    const result = await this._pool.query(sql, [playlistId]);

    if (!result.rowCount) {
      throw new NotFoundError('Failed, playlist ID not found!');
    }

    return result.rows[0];
  }

  /**
   * Find all playlist
   *
   * @param {string} playlistId Playlist id
   * @return {any} Playlist model
   */
  async getSongsFromPlaylistId(playlistId) {
    try {
      const result = await this._cacheControl.get(`playlist:${playlistId}`);

      return JSON.parse(result);
    } catch {
      const sql = [
        'SELECT songs.id, songs.title, songs.performer',
        'FROM songs',
        'LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id',
        'WHERE playlist_songs.playlist_id=$1',
      ].join(' ');
      const result = await this._pool.query(sql, [playlistId]);
      const parseToJSON = JSON.stringify(result.rows);

      await this._cacheControl.set(`playlist:${playlistId}`, parseToJSON);

      return result.rows;
    }
  }
}

module.exports = {PlayistsService};
