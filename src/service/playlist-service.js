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
   * Create new playlist
   * @param {any} songName song name
   * @param {any} owner user id
   * @return {any}
   */
  async storePlaylist(songName, owner) {
    const playlistId = `playlist-${nanoid(16)}`;
    const queryText = `
    INSERT INTO playlists(id,
      name,
      owner
    ) VALUES ($1, $2, $3)
    RETURNING id
    `;
    const queryValues = [playlistId, songName, owner];
    const result = await this._db.query(queryText, queryValues);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * Get palylist
   * @param {any} owner User id
   * @return {any}
   */
  async getPlaylists(owner) {
    const queryText = `
      SELECT playlists.id,
        playlists.name,
        users.username
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
   * Get playlist by palylis id
   * @param {string} id Playlist id
   * @return {any}
   */
  async getPlaylistById(id) {
    const queryText = `
      SELECT playlists.id,
        playlists.name,
        users.username
      FROM playlists
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
   * Hapus playlist by palylist id
   * @param {string} id Playlit id
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
   * Create palylist song
   * @param {string} songId song id
   * @param {string} playlistId Playlist id
   */
  async storeSongToPlaylist(songId, playlistId) {
    const {songsService} = this._service;

    await songsService.verifyExistingSongById(songId);

    const id = `sp-${nanoid(16)}`;
    const queryText = `
    INSERT INTO playlist_songs(id
      playlist_id,
      song_id
    ) VALUES ($1, $2, $3)
    `;
    const queryValues = [id, playlistId, songId];
    const result = await this._pool.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist');
    }
  }

  /**
   * Get playlist  song by user
   */
  async getPlaylistSongsById() {

  }

  /**
   * Get song in playlist
   * @param {string} playlistId Playlist id
   * @return {any}
   */
  async getSongsInPlaylist(playlistId) {
    const queryText = `
      SELECT songs.id,
        songs.title,
        songs.performer
      FROM songs
      LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1
      GROUP BY songs.id
    `;
    const queryValues = [playlistId];
    const result = await this._pool.query(queryText, queryValues);

    return result.rows.map(mapGetSongs);
  }

  /**
   * Delete song from playlist by song id
   * @param {string} songId Song string
   */
  async deleteSongBySongId(songId) {
    const queryText = 'DELETE FROM playlistsongs WHERE song_id = $1';
    const queryValues = [songId];
    const result = await this._pool.query(queryText, queryValues);

    if (!result.rowCount) {
      const _message =
        'Gagal menghapus lagu dari playlist. Id song tidak ditemukan';
      throw new InvariantError(_message);
    }
  }

  /**
   * Create playlist activities
   * @param {any} type Belum tau ini parameter untuk apa
   * @param {any} param1 param for insert
   */
  async storePlaylistActivities(type, {playlistId, userId, songId}) {
    const id = `history-${nanoid(16)}`;
    const timeNow = new Date();
    const queryText = `
    INSERT INTO playlist_song_activities(id,
      playlist_id,
      song_id,
      user_id,
      action,
      time
    ) VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const queryValues = [id, playlistId, songId, userId, type, timeNow];
    const result = await this._pool.query(queryText, queryValues);
    if (!result.rowCount) {
      throw new InvariantError('gagal menambahkan atifitas playlist');
    }
  }

  /**
   * Get history palylist
   * @param {any} playlistId Palylist id
   * @return {any}
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
    `;
    const queryValues = [playlistId];
    const result = await this._pool.query(queryText, queryValues);

    if (!result.rowCount) {
      throw new NotFoundError('playlist ID tidak ditemukan');
    }

    return result.rows;
  }

  /**
   * Check palylist owner
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
      const _message = 'Anda tidak mempunyai akses. Atas resource ini...';
      throw new AuthorizationError(_message);
    }
  }

  /**
   * Verifikasi palylist akses
   * @param {string} playlistId Playlist id
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
        await collaborationService.verifyCollaborator(
            playlistId,
            userId,
        );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = {PlaylistService};
