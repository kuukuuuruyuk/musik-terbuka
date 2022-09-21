const {nanoid} = require('nanoid');
const {AuthorizationError} = require('../exception/authorization-error');
const {NotFoundError} = require('../exception/not-found-error');

/**
 * Playlist service
 */
class PlaylistService {
  /**
   * Playlist servis constructor
   * @param {any} db Database Pool
   * @param {any} service Service injeksi
   */
  constructor(db, service) {
    this._db = db;
    this._service = service;
  }

  /**
   * Create playlist
   * @param {string} songName song name
   * @param {string} owner user id
   * @return {any} return json id plyalist
   */
  async storePlaylist(songName, owner) {
    const id = `playlist-${nanoid(16)}`;
    const queryText = 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id';
    const queryValues = [id, songName, owner];

    const result = await this._db.query(queryText, queryValues);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * get playlist owner
   * @param {string} owner user id
   * @return {any} return json
   */
  async getPlaylists(owner) {
    const queryText = `
      SELECT playlists.id, playlists.name, users.username
      FROM playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      INNER JOIN users ON playlists.owner = users.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlists.id, users.id
      LIMIT 2
    `;
    const queryValues = [owner];

    const result = await this._db.query(queryText, queryValues);
    return result.rows;
  }

  /**
   * Get playlist by id
   * @param {string} id playlist id
   * @return {any} json playlist
   */
  async getPlaylistMappedById(id) {
    const queryText = `
      SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1
    `;
    const queryValues = [id];

    const result = await this._db.query(queryText, queryValues);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal menemukan playlist ID');
    }

    return result.rows[0];
  }

  /**
   * Delete playlist id
   * @param {string} id playlist id
   */
  async deletePlaylistById(id) {
    const queryText = 'DELETE FROM playlists WHERE id = $1';
    const queryValues = [id];

    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus playlist, Id tidak ditemukan');
    }
  }

  /**
   * Cretate song to playlist
   * @param {string} songId song id
   * @param {string} playlistId playlist id
   */
  async storeSongToPlaylist(songId, playlistId) {
    const {songService} = this._service;
    await songService.verifyExistingSongById(songId);

    const id = `pl-${nanoid(16)}`;
    const queryText = 'INSERT INTO playlist_songs VALUES ($1, $2, $3)';
    const queryValues = [id, playlistId, songId];

    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist');
    }
  }

  /**
   * Get song playlist id
   * @param {string} playlistId playlist id
   * @return {any} playlist id
   */
  async getSongsInPlaylist(playlistId) {
    const queryText = `
      SELECT songs.id, songs.title, songs.performer FROM songs
      LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1
      GROUP BY songs.id
    `;
    const queryValues = [playlistId];
    const result = await this._db.query(queryText, queryValues);

    return result.rows.map((item) => ({
      id: item.id,
      title: item.title,
      performer: item.performer,
    }));
  }

  /**
   * Hapus song from playlist id by song id
   * @param {string} songId Song id
   */
  async deleteSongFromPlaylistBySongId(songId) {
    const queryText = 'DELETE FROM playlist_songs WHERE song_id = $1';
    const queryValues = [songId];

    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      const message =
        'Gagal menghapus lagu dari playlist. Id song tidak ditemukan';
      throw new InvariantError(message);
    }
  }

  /**
   * Crete plaulist activities
   * @param {string} type type playlist
   * @param {any} param1 user param
   */
  async storePlaylistActivities(type, {playlistId, userId, songId}) {
    const id = `history-${nanoid(16)}`;
    const timeNow = new Date().toISOString();

    const queryText =
      'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6)';
    const queryValues = [id, playlistId, songId, userId, type, timeNow];

    const result = await this._db.query(queryText, queryValues);
    if (!result.rowCount) {
      throw new InvariantError('gagal menambahkan atifitas playlist');
    }
  }

  /**
   * get history
   * @param {string} playlistId Playlist id
   * @return {any} json playlist
   */
  async getHistoryByPlaylistId(playlistId) {
    const queryText = `
      SELECT users.username,
        songs.title,
        playlist_song_activities.action,
        playlist_song_activities.time
      FROM playlist_song_activities
      INNER JOIN users ON users.id = playlist_song_activities.user_id
      INNER JOIN songs ON songs.id = playlist_song_activities.song_id
      WHERE playlist_song_activities.playlist_id = $1
      LIMIT 3
    `;
    const queryValues = [playlistId];

    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new NotFoundError('playlist ID tidak ditemukan');
    }

    return result.rows;
  }

  /**
   * verifikasi playlist id
   * @param {string} playlistId palylist id
   * @param {string} owner user id
   */
  async verifyPlaylistOwner(playlistId, owner) {
    const queryText = 'SELECT id, owner FROM playlists WHERE id = $1';
    const queryValues = [playlistId];

    const result = await this._db.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError(
          'Anda tidak mempunyai akses. Atas resource ini...',
      );
    }
  }

  /**
   * verifikasi playlist access
   * @param {string} playlistId playlist id
   * @param {string} userId user id
   */
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        const {collaborationService} = this._service;
        await collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = {PlaylistService};
