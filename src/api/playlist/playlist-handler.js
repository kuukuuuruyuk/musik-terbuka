/**
 * Api plugin Playlist
 */
class PlaylistHandler {
  /**
   * Playlist handler
   *
   * @param {any} service Playlist services
   * @param {any} validator Joi validator
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
   * Menambahakan playlis
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Playlist data
   */
  async postPlaylistHandler(request, h) {
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
  }

  /**
   * Show playlist handler
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Playlist data
   */
  async getPlaylistsHandler(request, h) {
    const {auth} = request;
    const {id: userId} = auth.credentials;
    const {playlistService} = this._service;
    const playlists = await playlistService.getPlaylists(userId);

    return h.response({
      status: 'success',
      data: {playlists},
    });
  }

  /**
   * Hapus data playlist
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Playlist data
   */
  async deletePlaylistHandler(request, h) {
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
  }

  /**
   * Create song by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Song playlist data
   */
  async postSongToPlaylistHandler(request, h) {
    const {payload, auth, params} = request;
    const {playlistValidator} = this._validator;

    playlistValidator.validatePostSongToPlaylist(payload);

    const {songId} = payload;
    const {playlistId} = params;
    const {id: userId} = auth.credentials;
    const {playlistService, songService} = this._service;

    await songService.verifyExistingSongById(songId);
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
  }

  /**
   * Show song from playlist
   *
   * @param {any} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Song from playlist
   */
  async getSongsFromPlaylistHandler(request, h) {
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
  }

  /**
   * Delete song from playlist
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any}
   */
  async deleteSongFromPlaylistHandler(request, h) {
    const {payload, params, auth} = request;

    this._validator.playlistValidator.validateDeleteSongFromPlaylist(payload);

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
  }

  /**
   * Show playlist activitie
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Playlist data
   */
  async getPlalistActivitiesHandler(request, h) {
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
  }
}

module.exports = {PlaylistHandler};
