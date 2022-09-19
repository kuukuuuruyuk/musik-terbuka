const {failedWebResponse} = require('../../utils/web-response');

/**
 * Class for song handler
 */
class SongHandler {
  /**
   * Method construktor song handler
   * @param {any} service service dependenci enjiksi
   * @param {any} validator validator dep injeksion
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
   * Store song
   * Method post
   * @param {Request} request request
   * @param {any} h handler
   * @return {any}
   */
  async postSongHandler(request, h) {
    try {
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
    } catch (error) {
      console.log(error);
      return failedWebResponse(error, h);
    }
  }

  /**
   * Show songs
   * Method get
   * @param {Request} request request
   * @param {any} h handler
   * @return {any}
   */
  async getSongsHandler(request, h) {
    try {
      const {songValidator} = this._validator;

      await songValidator.validateSongPayload({});

      const {query} = request;
      const {songService: _songService} = this._service;
      const {title, performer} = query;
      const songs = await _songService.getSongs({title, performer});

      const _response = h.response({
        status: 'success',
        data: {songs},
      });

      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Show song by id
   * Method get
   * @param {Request} request request
   * @param {any} h handler
   * @return {any}
   */
  async getSongByIdHandler(request, h) {
    try {
      const {songService: _songService} = this._service;
      const {id: songId} = request.params;
      const song = await _songService.getSongById(songId);

      const _response = h.response({
        status: 'success',
        data: {song},
      });

      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Update song by id
   * Method put
   * @param {Request} request request
   * @param {any} h handler
   * @return {any}
   */
  async putSongByIdHandler(request, h) {
    try {
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
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Delete song by id
   * Method delete
   * @param {Request} request request
   * @param {any} h handler
   * @return {any}
   */
  async deleteSongByIdHandler(request, h) {
    try {
      const {id: songId} = request.params;
      const {songService: _songService} = this._service;

      await _songService.deleteSongById(songId);

      const _response = h.response({
        status: 'success',
        message: 'song has been deleted!',
      });

      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }
}

module.exports = {SongHandler};
