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
    const playlistId = await this._service.playlistService.storePlaylist(
        payload?.name,
        credentialId,
    );

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
    const {auth} = request;
    const userId = auth.credentials?.id;
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

    await Promise.all([
      this._service.playlistService.verifyPlaylistOwner(
          playlistId,
          credentialId,
      ),
      this._service.playlistService.deletePlaylistById(playlistId),
    ]);

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
    const {playlistValidator} = this._validator;
    playlistValidator.validatePostSongToPlaylist(request.payload);

    const {payload, auth, params} = request;
    const songId = payload?.songId;
    const playlistId = params?.playlistId;
    const userId = auth.credentials?.id;

    await Promise.all([
      this._service.songService.verifyExistingSongById(songId),
      this._service.playlistService.verifyPlaylistAccess(playlistId, userId),
      this._service.playlistService.storeSongToPlaylist(songId, playlistId),
      this._service.playlistService.storePlaylistActivities('add', {
        playlistId,
        userId,
        songId,
      }),
    ]);

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
    const {playlistService} = this._service;

    const [, playlistData, songsData] = await Promise.all([
      playlistService.verifyPlaylistAccess(playlistId, credentialId),
      playlistService.getPlaylistMappedById(playlistId),
      playlistService.getSongsInPlaylist(playlistId),
    ]);

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
    const {playlistValidator} = this._validator;

    playlistValidator.validateDeleteSongFromPlaylist(request?.payload);

    const {payload, params, auth} = request;
    const playlistId = params?.playlistId;
    const songId = payload?.songId;
    const userId = auth.credentials?.id;

    await Promise.all([
      this._service.playlistService.verifyPlaylistAccess(playlistId, userId),
      this._service.playlistService.deleteSongFromPlaylistBySongId(songId),
      this._service.playlistService.storePlaylistActivities('delete', {
        playlistId,
        userId,
        songId,
      }),
    ]);

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

    const [, activities] = await Promise.all([
      this._service.playlistService.verifyPlaylistAccess(playlistId, userId),
      this._service.playlistService.getHistoryByPlaylistId(playlistId),
    ]);

    return h.response({
      status: 'success',
      data: {playlistId, activities},
    });
  }
}

module.exports = {PlaylistHandler};
