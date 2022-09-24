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
    const {payload} = request;
    const {songValidator} = this._validator;

    await songValidator.validateSongPayload(payload);

    const {songService: _songService} = this._service;
    const {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    } = payload;

    const songId = await _songService.storeSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    const _response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {songId},
    });

    _response.code(201);
    return _response;
  }

  /**
   * Show song data
   *
   * @param {Request} request request
   * @param {any} h handler
   * @return {any} Song data
   */
  async getSongsHandler(request, h) {
    const {songService} = this._service;
    const {query} = request;
    const {title, performer} = query;
    const songs = await songService.getSongs({title, performer});

    const _response = h.response({
      status: 'success',
      data: {songs},
    });

    return _response;
  }

  /**
   * Show song by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Song data
   */
  async getSongByIdHandler(request, h) {
    const {songService} = this._service;
    const {id: songId} = request.params;
    const song = await songService.getSongById(songId);

    const _response = h.response({
      status: 'success',
      data: {song},
    });

    return _response;
  }

  /**
   * Update song by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Song data
   */
  async putSongByIdHandler(request, h) {
    const {payload, params} = request;
    const {songValidator: _songValidator} = this._validator;
    _songValidator.validateSongPayload(payload);
    const {id: songId} = params;
    const {songService: _songService} = this._service;

    await _songService.updateSongById(songId, payload);

    const _response = h.response({
      status: 'success',
      message: 'song has been updated!',
    });

    return _response;
  }

  /**
   * Delete song by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any}
   */
  async deleteSongByIdHandler(request, h) {
    const {id: songId} = request.params;
    const {songService: _songService} = this._service;

    await _songService.deleteSongById(songId);

    const _response = h.response({
      status: 'success',
      message: 'song has been deleted!',
    });

    return _response;
  }
}

module.exports = {SongHandler};
