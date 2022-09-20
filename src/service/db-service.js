/**
 * Database service
 */
class DBService {
  /**
   * Database service constructtor
   * @param {any} db Databse pool
   */
  constructor(db) {
    this._db = db;
  }

  /**
   * Reset isi database
   */
  async truncateDB() {
    const queryText = `
    TRUNCATE songs,
      albums,
      playlist_songs,
      authentications,
      users,
      playlists,
      collaborations,
      playlist_song_activities
    `;

    await this._db.query(queryText);
  }
}

module.exports = {DBService};
