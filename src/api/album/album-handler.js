/**
 * Api plugin album
 */
class AlbumHandler {
  /**
   * Album handler
   *
   * @param {any} service Album services
   * @param {any} validator Joi handler
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
   * Create album
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Album data
   */
  async postAlbumHandler(request, h) {
    const {payload} = request;
    const {albumValidator} = this._validator;

    albumValidator.validateAlbumPayload(payload);

    const {name, year} = payload;
    const {albumService: _albumService} = this._service;
    const albumId = await _albumService.storeAlbum({name, year});

    const _response = h.response({
      status: 'success',
      data: {albumId},
    });

    _response.code(201);
    return _response;
  }

  /**
   * Show album by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Album data
   */
  async getAlbumByIdHandler(request, h) {
    const {id} = request.params;
    const {
      albumService,
      songService,
    } = this._service;
    const album = await albumService.getAlbumById(id);
    const songs = await songService.getSongsByAlbumId(id);

    const _response = h.response({
      status: 'success',
      data: {
        album: {...album, songs},
      },
    });

    _response.code(200);
    return _response;
  }

  /**
   * Update album by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Album data
   */
  async putAlbumByIdHandler(request, h) {
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
  }

  /**
   * Delete album by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Album data
   */
  async deleteAlbumByIdHandler(request, h) {
    const {id} = request.params;
    const {albumService: _albumService} = this._service;

    await _albumService.deleteAlbumById(id);

    const _response = h.response({
      status: 'success',
      message: 'Album has beed deleted!',
    });

    return _response;
  }
}

module.exports = {AlbumHandler};
