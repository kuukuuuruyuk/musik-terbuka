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
    const querySql = [
      'TRUNCATE',
      'songs, albums, playlist_songs, authentications, users, playlists,',
      'collaborations, playlist_song_activities, user_album_likes',
    ].join(' ');

    await this._db.query(querySql);
  }
}

module.exports = {DBService};
