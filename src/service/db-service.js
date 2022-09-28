/**
 * DBService
 */
class DBService {
  /**
   * Database service
   *
   * @param {Pool} db Database pool
   */
  constructor(db) {
    this._db = db;
  }

  /**
   * Reset isi database
   */
  async truncateDB() {
    const sql = [
      'TRUNCATE',
      'songs, albums, playlist_songs, authentications, users, playlists,',
      'collaborations, playlist_song_activities, user_album_likes',
    ].join(' ');

    await this._db.query(sql);
  }
}

module.exports = {DBService};
