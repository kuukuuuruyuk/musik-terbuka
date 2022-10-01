/**
 * Api plugin song
 */
class SongHandler {
  /**
   * Song handler
   *
   * @param {any} service Song services
   * @param {any} validator Joi validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  /**
   * Create song
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Song data
   */
  async postSongHandler(request, h) {
    const payload = request.payload;

    await this._validator.songValidator.validateSongPayload(payload);

    const songId = await this._service.songService.storeSong(payload);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {songId},
    }).code(201);
  }

  /**
   * Show song data
   *
   * @param {Request} request request
   * @param {any} h handler
   * @return {any} Song data
   */
  async getSongsHandler(request, h) {
    const {title, performer} = request.query;
    const songs = await this._service.songService.getSongs(title, performer);

    return h.response({
      status: 'success',
      data: {songs},
    });
  }

  /**
   * Show song by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Song data
   */
  async getSongByIdHandler(request, h) {
    const songId = request.params?.id;

    return h.response({
      status: 'success',
      data: {
        song: await this._service.songService.getSongById(songId),
      },
    });
  }

  /**
   * Update song by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Song data
   */
  async putSongByIdHandler(request, h) {
    this._validator.songValidator.validateSongPayload(request.payload);

    const {payload, params} = request;
    const songId = params?.id;

    await this._service.songService.updateSongById(songId, payload);

    return h.response({
      status: 'success',
      message: 'song has been updated!',
    });
  }

  /**
   * Delete song by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any}
   */
  async deleteSongByIdHandler(request, h) {
    const songId = request.params?.id;

    await this._service.songService.deleteSongById(songId);

    return h.response({
      status: 'success',
      message: 'song has been deleted!',
    });
  }
}

module.exports = {SongHandler};
