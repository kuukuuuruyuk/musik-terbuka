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
    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  /**
   * Create album
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Album data as 201 code is success
   */
  async postAlbumHandler(request, h) {
    this._validator.albumValidator.validateAlbumPayload(request.payload);

    const {name, year} = request.payload;
    const albumId = await this._service.albumService.storeAlbum(name, year);

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
    const albumId = request.params?.id;
    const [album, songs] = await Promise.all([
      this._service.albumService.getAlbumById(albumId),
      this._service.songService.getSongsByAlbumId(albumId),
    ]);

    return h.response({
      status: 'success',
      data: {album: {...album, songs}},
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
    this._validator.albumValidator.validateAlbumPayload(request.payload);

    const {params, payload} = request;
    const albumId = params?.id;

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
    const albumId = request.params?.id;

    await this._service.albumService.deleteAlbumById(albumId);

    return h.response({
      status: 'success',
      message: 'Album has beed deleted!',
    });
  }

  /**
   * Post album
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi server
   * @return {any} Album data
   */
  async postAlbumCoverHandler(request, h) {
    const cover = request.payload?.cover;
    const albumId = request.params?.id;

    this._validator.uploadValidator.validateUploadHeader(cover.hapi.headers);

    const filename = await this._service.uploadService.uploadCover(cover);

    await this._service.albumService.editAlbumCoverById(albumId, filename);

    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }

  /**
   * Post album like
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi server
   * @return {any} Album data
   */
  async postAlbumLikeHandler(request, h) {
    const albumId = request.params?.id;
    const userId = request.auth.credentials?.id;
    const albumService = this._service.albumService;
    const checkAlbumsLike =
      await albumService.verifyExistAlbumLikeStatusById(albumId, userId);

    if (checkAlbumsLike > 0) {
      await albumService.deleteAlbumLikeStatusById(albumId, userId);

      return h.response({
        status: 'success',
        message: 'Berhasil melakukan dislike pada album!',
      }).code(201);
    } else {
      await albumService.addAlbumLikeStatus(albumId, userId);

      return h.response({
        status: 'success',
        message: 'Berhasil menyukai album!',
      }).code(201);
    }
  }

  /**
   * Get album like
   *
   * @param {Reauest} request Request payload
   * @param {any} h Hapi server
   * @return {any} Album data
   */
  async getAlbumLikesHandler(request, h) {
    const albumId = request.params?.id;
    const {count, cache} =
      await this._service.albumService.getAlbumLikesCountByAlbumId(albumId);

    const queryData = {
      status: 'success',
      data: {likes: count},
    };

    if (cache) {
      return h.response(queryData).header('X-Data-Source', 'cache');
    }

    return h.response(queryData);
  }
}

module.exports = {AlbumHandler};
