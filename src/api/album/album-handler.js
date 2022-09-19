const {failedWebResponse} = require('../../utils/web-response');

/**
 * Class for album handler
 */
class AlbumHandler {
  /**
   * Method construktor album handler
   * @param {any} service service dep inkjesi
   * @param {any} validator validator dep injeksi
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  /**
   * Store album
   * Method post
   * @param {Request} request request
   * @param {any} h handler
   * @return {any}
   */
  async postAlbumHandler(request, h) {
    try {
      const {payload} = request;
      const {albumValidator: _albumValidator} = this._validator;

      await _albumValidator.validateAlbumPayload(payload);

      const {name, year} = payload;
      const {albumService: _albumService} = this._service;
      const albumId = await _albumService.storeAlbum({name, year});

      const _response = h.response({
        status: 'success',
        data: {albumId},
      });

      _response.code(201);
      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Show album by id
   * Method get
   * @param {Request} request request
   * @param {any} h handler
   * @return {any}
   */
  async getAlbumByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const {
        albumService: _albumService,
        songService: _songService,
      } = this._service;
      const album = await _albumService.getAlbumById(id);
      const songs = await _songService.getSongsByAlbumId(id);

      const _response = h.response({
        status: 'success',
        data: {
          album: {...album, songs},
        },
      });

      _response.code(200);
      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Update album by id
   * Method put
   * @param {Request} request request
   * @param {any} h handler
   * @return {any}
   */
  async putAlbumByIdHandler(request, h) {
    try {
      const {params, payload} = request;
      const {albumValidator: _albumValidator} = this._validator;

      await _albumValidator.validateAlbumPayload(payload);

      const {id} = params;
      const {albumService: _albumService} = this._service;

      await _albumService.updateAlbumById(id, payload);

      const _response = h.response({
        status: 'success',
        message: 'Album has beed updated!',
      });

      _response.code(200);
      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Delete album by id
   * Method delete
   * @param {Request} request request
   * @param {any} h handler
   * @return {any}
   */
  async deleteAlbumByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const {albumService: _albumService} = this._service;

      await _albumService.deleteAlbumById(id);

      const _response = h.response({
        status: 'success',
        message: 'Album has beed deleted!',
      });

      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }
}

module.exports = {AlbumHandler};
