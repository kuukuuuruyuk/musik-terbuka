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
    this._validator.playlistValidator.validatePostPlaylist(request.payload);

    const {payload, auth} = request;
    const credentialId = auth.credentials?.id;
    const name = payload?.name;
    const playlistId =
      await this._service.playlistService.storePlaylist(name, credentialId);

    return h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {playlistId},
    }).code(201);
  }

  /**
   * Show playlist handler
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Playlist data
   */
  async getPlaylistsHandler(request, h) {
    const userId = request.auth.credentials?.id;
    const playlists = await this._service.playlistService.getPlaylists(userId);

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
    const playlistId = params?.playlistId;
    const credentialId = auth.credentials?.id;
    const playlistService = this._service.playlistService;

    await playlistService.verifyPlaylistOwner(
        playlistId,
        credentialId,
    );
    await playlistService.deletePlaylistById(playlistId, credentialId);

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
    const playlistValidator = this._validator.playlistValidator;

    playlistValidator.validatePostSongToPlaylist(request.payload);

    const {payload, auth, params} = request;
    const songId = payload?.songId;
    const playlistId = params?.playlistId;
    const userId = auth.credentials?.id;
    const {songService, playlistService} = this._service;

    await songService.verifyExistingSongById(songId);
    await playlistService.verifyPlaylistAccess(playlistId, userId);
    await playlistService.storeSongToPlaylist(songId, playlistId);
    await playlistService.storePlaylistActivities('add', {
      playlistId,
      userId,
      songId,
    });

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    }).code(201);
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
    const playlistId = params?.playlistId;
    const credentialId = auth.credentials?.id;
    const playlistService = this._service.playlistService;

    await playlistService.verifyPlaylistAccess(playlistId, credentialId);

    const playlists =
      await playlistService.getPlaylistMappedById(playlistId);
    const songs = await playlistService.getSongsInPlaylist(playlistId);

    return h.response({
      status: 'success',
      data: {
        playlist: {
          ...playlists,
          songs,
        },
      },
    });
  }

  /**
   * Delete song from playlist
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Songs data
   */
  async deleteSongFromPlaylistHandler(request, h) {
    const playlistValidator = this._validator.playlistValidator;

    playlistValidator.validateDeleteSongFromPlaylist(request.payload);

    const {payload, params, auth} = request;
    const playlistId = params?.playlistId;
    const songId = payload?.songId;
    const userId = auth.credentials?.id;
    const playlistService = this._service.playlistService;

    await playlistService.verifyPlaylistAccess(playlistId, userId);
    await playlistService.deleteSongFromPlaylistBySongId(songId, playlistId);
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
    const playlistId = params?.playlistId;
    const userId = auth.credentials?.id;
    const playlistService = this._service.playlistService;

    await playlistService.verifyPlaylistAccess(playlistId, userId);

    const activities = await playlistService.getHistoryByPlaylistId(playlistId);

    return h.response({
      status: 'success',
      data: {playlistId, activities},
    });
  }
}

module.exports = {PlaylistHandler};
