const {nanoid} = require('nanoid');
const {AuthorizationError} = require('../exception/authorization-error');
const {NotFoundError} = require('../exception/not-found-error');

/**
 * Playlist
 */
class PlaylistService {
  /**
   * Playlist service
   *
   * @param {Pool} db Database connection
   * @param {any} service Playlist service
   */
  constructor(db, service) {
    this._db = db;
    this._service = service;
  }

  /**
   * Create playlist
   *
   * @param {string} songName Song name
   * @param {string} owner User id
   * @return {string} Id plyalist
   */
  async storePlaylist(songName, owner) {
    const playlistId = nanoid(16);
    const sql = 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id';
    const playlists = await this._db.query(sql, [playlistId, songName, owner]);

    if (!playlists.rows[0]?.id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    await this._service.cacheControlService.del(`playlists`);

    return playlists.rows[0]?.id;
  }

  /**
   * Get playlist owner
   *
   * @param {string} owner user id
   * @return {any} Playlist model
   */
  async getPlaylists(owner) {
    const sql = [
      'SELECT playlists.id, playlists.name, users.username',
      'FROM playlists',
      'LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id',
      'INNER JOIN users ON playlists.owner = users.id',
      'WHERE playlists.owner = $1 OR collaborations.user_id = $1',
      'GROUP BY playlists.id, users.id',
      'LIMIT 2',
    ].join(' ');
    const playlists = await this._db.query(sql, [owner]);

    await this._service.cacheControlService.set(
        `playlists`,
        JSON.stringify(playlists.rows),
        (60 * 30),
    );

    return playlists.rows;
  }

  /**
   * Get playlist by id
   *
   * @param {string} playlistId Playlist id
   * @return {any} Playlist model
   */
  async getPlaylistMappedById(playlistId) {
    const sql = [
      'SELECT playlists.id, playlists.name, users.username',
      'FROM playlists',
      'LEFT JOIN users ON users.id = playlists.owner',
      'WHERE playlists.id = $1',
    ].join(' ');
    const playlists = await this._db.query(sql, [playlistId]);

    if (!playlists.rowCount) {
      throw new NotFoundError('Gagal menemukan playlist ID');
    }

    return playlists.rows[0];
  }

  /**
   * Delete playlist id
   *
   * @param {string} playlistId Playlist id
   */
  async deletePlaylistById(playlistId) {
    const sql = 'DELETE FROM playlists WHERE id = $1';
    const playlists = await this._db.query(sql, [playlistId]);

    if (!playlists.rowCount) {
      throw new NotFoundError('Gagal menghapus playlist, Id tidak ditemukan');
    }

    await this._service.cacheControlService.del(`playlists`);
  }

  /**
   * Cretate song to playlist
   *
   * @param {string} songId Song id
   * @param {string} playlistId Playlist id
   */
  async storeSongToPlaylist(songId, playlistId) {
    await this._service.songService.verifyExistingSongById(songId);

    const plSongId = nanoid(16);
    const sql = 'INSERT INTO playlist_songs VALUES ($1, $2, $3)';
    const playlists = await this._db.query(sql, [plSongId, playlistId, songId]);

    if (!playlists.rowCount) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist');
    }

    await this._service.cacheControlService.del(`playlist:songs:${playlistId}`);
  }

  /**
   * Get song playlist id
   *
   * @param {string} playlistId Playlist id
   * @return {any} Playlist model
   */
  async getSongsInPlaylist(playlistId) {
    const controlService = this._service.cacheControlService;
    try {
      const playlist = await controlService.get(`playlist:song:${playlistId}`);

      return JSON.parse(playlist);
    } catch (_error) {
      const sql = [
        'SELECT songs.id, songs.title, songs.performer',
        'FROM songs',
        'LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id',
        'WHERE playlist_songs.playlist_id = $1',
        'GROUP BY songs.id',
      ].join(' ');
      const playlist = await this._db.query(sql, [playlistId]);

      await Promise.all([
        controlService.set(
            `playlist:songs:${playlistId}`,
            JSON.stringify(playlist.rows),
            (60 * 30),
        ),
        controlService.set(
            `playlist:song:${playlistId}`,
            JSON.stringify(playlist.rows),
        ),
      ]);

      return playlist.rows;
    }
  }

  /**
   * Hapus song from playlist id by song id
   *
   * @param {string} songId Song id
   */
  async deleteSongFromPlaylistBySongId(songId) {
    const sql = 'DELETE FROM playlist_songs WHERE song_id = $1';
    const playlist = await this._db.query(sql, [songId]);

    if (!playlist.rowCount) {
      const message =
        'Gagal menghapus lagu dari playlist. Id song tidak ditemukan';
      throw new InvariantError(message);
    }

    await this._service.cacheControlService.del(`playlist:songs:${songId}`);
  }

  /**
   * Crete plaulist activities
   *
   * @param {string} type Playlist type
   * @param {any} param1 User model
   */
  async storePlaylistActivities(type, {playlistId, userId, songId}) {
    const activitieId = nanoid(16);
    const timeNow = new Date().toISOString();
    const sql =
      'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6)';
    const activities = await this._db.query(sql, [
      activitieId,
      playlistId,
      songId,
      userId,
      type,
      timeNow,
    ]);

    if (!activities.rowCount) {
      throw new InvariantError('gagal menambahkan atifitas playlist');
    }

    await this._service.cacheControlService.del(
        `playlist:activities:${playlistId}`,
    );
  }

  /**
   * Show history
   *
   * @param {string} playlistId Playlist id
   * @return {any} Playlist model
   */
  async getHistoryByPlaylistId(playlistId) {
    const sql = [
      'SELECT users.username, songs.title, psa.action, psa.time',
      'FROM playlist_song_activities AS psa',
      'INNER JOIN users ON users.id = psa.user_id',
      'INNER JOIN songs ON songs.id = psa.song_id',
      'INNER JOIN playlists ON playlists.id = psa.playlist_id',
      'WHERE psa.playlist_id = $1',
      'ORDER BY psa.time ASC',
      'LIMIT 3',
    ].join(' ');
    const playlist =
      await this._db.query(sql, [playlistId]);

    if (!playlist.rowCount) {
      throw new NotFoundError('playlist ID tidak ditemukan');
    }

    await this._service.cacheControlService.set(
        `playlist:activities:${playlistId}`,
        JSON.stringify(playlist.rows),
    );

    return playlist.rows;
  }

  /**
   * Verifikasi playlist id
   *
   * @param {string} playlistId Palylist id
   * @param {string} owner User id
   */
  async verifyPlaylistOwner(playlistId, owner) {
    const sql = 'SELECT id, owner FROM playlists WHERE id = $1';
    const playlist = await this._db.query(sql, [playlistId]);

    if (!playlist.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (playlist.rows[0]?.owner !== owner) {
      throw new AuthorizationError(
          'Anda tidak mempunyai akses. Atas resource ini...',
      );
    }
  }

  /**
   * Verifikasi playlist access
   *
   * @param {string} playlistId Playlist id
   * @param {string} userId User id
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
