const {failedWebResponse} = require('../../utils/web-response');

/**
 * Playlist handler
 */
class PlaylistHandler {
  /**
   * Playlist constructor
   * @param {any} service Servis dep injesi
   * @param {any} validator validator dep injeksi
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler =
      this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler =
      this.deleteSongFromPlaylistHandler.bind(this);
    this.getPlalistActivitiesHandler =
      this.getPlalistActivitiesHandler.bind(this);
  }

  /**
   * Menambahakan playlist
   * @param {Request} request Request body
   * @param {any} h handler
   * @return {any}
   */
  async postPlaylistHandler(request, h) {
    try {
      const {payload, auth} = request;
      const {playlistValidator} = this._validator;
      playlistValidator.validatePostPlaylist(payload);
      const {name} = payload;

      const {playlistService} = this._service;
      const {id: credentialId} = auth.credentials;
      const id = await playlistService.storePlaylist(name, credentialId);

      const _response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {playlistId: id},
      });

      _response.code(201);
      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Get playlist handler
   * @param {Request} request body
   * @param {any} h Hapi handler
   * @return {any}
   */
  async getPlaylistsHandler(request, h) {
    try {
      const {auth} = request;
      const {id: userId} = auth.credentials;
      const {playlistService} = this._service;
      const playlists = await playlistService.getPlaylists(userId);

      return h.response({
        status: 'success',
        data: {playlists},
      });
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Hpaus playlist
   * @param {Request} request Request body
   * @param {any} h Hapi handler
   * @return {any}
   */
  async deletePlaylistHandler(request, h) {
    try {
      const {auth, params} = request;
      const {playlistId} = params;
      const {id: credentialId} = auth.credentials;
      const {playlistService} = this._service;
      await playlistService.verifyPlaylistOwner(playlistId, credentialId);
      await playlistService.deletePlaylistById(playlistId);

      return h.response({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      });
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * post dong by id
   * @param {*} request Request boddy
   * @param {*} h Hapi handler
   * @return {any}
   */
  async postSongToPlaylistHandler(request, h) {
    try {
      const {payload, auth, params} = request;
      const {playlistValidator} = this._validator;

      playlistValidator.validatePostSongToPlaylist(payload);

      const {songId} = payload;
      const {playlistId} = params;
      const {id: userId} = auth.credentials;
      const {playlistService} = this._service;

      await playlistService.verifyPlaylistAccess(playlistId, userId);
      await playlistService.storeSongToPlaylist(songId, playlistId);
      await playlistService.storePlaylistActivities('add', {
        playlistId,
        userId,
        songId,
      });

      const _response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });

      _response.code(201);
      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * get song from playlist
   * @param {any} request Request body
   * @param {any} h Hapi handler
   * @return {any}
   */
  async getSongsFromPlaylistHandler(request, h) {
    try {
      const {params, auth} = request;
      const {playlistId} = params;
      const {id: credentialId} = auth.credentials;
      const {playlistService} = this._service;

      await playlistService.verifyPlaylistAccess(playlistId, credentialId);
      const playlistData =
        await playlistService.getPlaylistMappedById(playlistId);
      const songsData =
        await playlistService.getSongsInPlaylist(playlistId);

      return h.response({
        status: 'success',
        data: {
          playlist: {
            ...playlistData,
            songs: songsData,
          },
        },
      });
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Delte song from playlist
   * @param {Request} request Request body
   * @param {any} h Hapi handler
   * @return {any}
   */
  async deleteSongFromPlaylistHandler(request, h) {
    try {
      const {payload, params, auth} = request;
      const {playlistValidator} = this._validator;
      playlistValidator.validateDeleteSongFromPlaylist(payload);

      const {playlistId} = params;
      const {songId} = payload;
      const {id: userId} = auth.credentials;
      const {playlistService} = this._service;

      await playlistService.verifyPlaylistAccess(playlistId, userId);
      await playlistService.deleteSongFromPlaylistBySongId(songId);
      await playlistService.storePlaylistActivities('delete', {
        playlistId,
        userId,
        songId,
      });

      return h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Get playlist activea
   * @param {Request} request Request body
   * @param {any} h Hapi server
   * @return {any}
   */
  async getPlalistActivitiesHandler(request, h) {
    try {
      const {params, auth} = request;
      const {playlistId} = params;
      const {id: userId} = auth.credentials;
      const {playlistService} = this._service;

      await playlistService.verifyPlaylistAccess(playlistId, userId);
      const activities =
        await playlistService.getHistoryByPlaylistId(playlistId);

      return h.response({
        status: 'success',
        data: {playlistId, activities},
      });
    } catch (error) {
      console.log('gh', error);
      return failedWebResponse(error, h);
    }
  }
}

module.exports = {PlaylistHandler};
