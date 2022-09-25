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
   * @return {any} Album data as 201 code is success
   */
  async postAlbumHandler(request, h) {
    const {payload} = request;

    this._validator.albumValidator.validateAlbumPayload(payload);

    const {name, year} = payload;
    const albumId = await this._service.albumService.storeAlbum({name, year});

    return h.response({
      status: 'success',
      data: {albumId},
    }).code(201);
  }

  /**
   * Show album by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Album data
   */
  async getAlbumByIdHandler(request, h) {
    const {id: albumId} = request.params;
    const {
      albumService,
      songService,
    } = this._service;
    const album = await albumService.getAlbumById(albumId);
    const songs = await songService.getSongsByAlbumId(albumId);

    return h.response({
      status: 'success',
      data: {
        album: {...album, songs},
      },
    });
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

    this._validator.albumValidator.validateAlbumPayload(payload);

    const {id: albumId} = params;
    await this._service.albumService.updateAlbumById(albumId, payload);

    return h.response({
      status: 'success',
      message: 'Album has beed updated!',
    });
  }

  /**
   * Delete album by id
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Album data
   */
  async deleteAlbumByIdHandler(request, h) {
    const {id: albumId} = request.params;

    await this._service.albumService.deleteAlbumById(albumId);

    return h.response({
      status: 'success',
      message: 'Album has beed deleted!',
    });
  }
}

module.exports = {AlbumHandler};
