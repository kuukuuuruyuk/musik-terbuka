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
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.deletePlaylistSonghandler = this.deletePlaylistSonghandler.bind(this);
    this.getSongsFromPlaylistHandler =
      this.getSongsFromPlaylistHandler.bind(this);
    this.getPlalistActivitiesHandler =
      this.getPlalistActivitiesHandler.bind(this);
  }

  /**
   * Menambahakan playlist
   * @param {Request} request Request from body
   * @param {any} h Hapi server handler
   * @return {any}
   */
  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistSchema(payload);
      const {name} = payload;
      const {id: credentialId} = auth.credentials;
      const playlistId = await this._service.addPlaylist(name, credentialId);

      const _response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {playlistId},
      });

      _response.code(201);
      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Melihat daftar playlist yang dimiliki
   * @param {Request} request Request from body
   * @param {any} h Hapi server handler
   * @return {any}
   */
  async getPlaylistsHandler(request, h) {
    try {
      const {authService} = this._service;
      const {id: userId} = authService.credentials;
      const {playlistService} = this._service;
      const result = await playlistService.getPlaylists(userId);

      const _response = h.response({
        status: 'success',
        data: {playlists: result},
      });

      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Menghapus playlist
   * @param {Request} request Request from body
   * @param {any} h Hapi server handler
   * @return {any}
   */
  async deletePlaylistHandler(request, h) {
    try {
      const {params} = request;
      const {playlistId} = params;
      const {authService} = this._service;
      const {id: credentialId} = authService.credentials;
      const {playlistService} = this._service;

      await playlistService.verifyPlaylistOwner(playlistId, credentialId);
      await playlistService.deletePlaylistById(playlistId);

      const _response = h.response({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      });

      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Menambahkan lagu ke playlist
   * @param {Request} request Request from body
   * @param {any} h Hapi server handler
   * @return {any}
   */
  async postPlaylistSongHandler(request, h) {
    try {
      const {payload} = request;
      const {playlistValidator} = this._validator;

      playlistValidator.validatePostSongToPlaylistSchema(payload);

      const {songId} = payload;
      const {playlistId} = params;
      const {id: userId} = auth.credentials;
      const {palaylistService} = this._service;

      await palaylistService.verifyPlaylistAccess(playlistId, userId);
      await palaylistService.addSongToPlaylist(songId, playlistId);
      await palaylistService.addPlaylistActivities('add', {
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
   * Menghapus lagu dari playlist
   * @param {Request} request Request from body
   * @param {any} h Hapi server handler
   * @return {any}
   */
  async deletePlaylistSonghandler(request, h) {
    try {
      const {payload} = request;
      const {playlistValidator} = this._validator;

      playlistValidator.validateDeleteSongFromPlaylistSchema(payload);

      const {playlistId} = params;
      const {songId} = payload;
      const {authService, playlistService} = this._service;
      const {id: userId} = authService.credentials;

      await playlistService.verifyPlaylistAccess(playlistId, userId);
      await playlistService.deleteSongFromPlaylistBySongId(songId);
      await playlistService.addPlaylistActivities('delete', {
        playlistId,
        userId,
        songId,
      });

      const _response = h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });

      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Get somng from palisi
   * @param {Request} request Request from body
   * @param {any} h Hapi server handler
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
      const songsData = await playlistService.getSongsInPlaylist(playlistId);

      const _response = h.response({
        status: 'success',
        data: {
          playlist: {
            ...playlistData,
            songs: songsData,
          },
        },
      });

      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Get playlist aktipiti
   * @param {Request} request Request from body
   * @param {any} h Hapi server handler
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

      const _response = h.response({
        status: 'success',
        data: {playlistId, activities},
      });

      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }
}

module.exports = {PlaylistHandler};
