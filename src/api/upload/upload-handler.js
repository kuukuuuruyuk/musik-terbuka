/**
 * UploadImagesHandler
 */
class UploadImagesHandler {
  /**
   * Upload images handler
   *
   * @param {any} service Upload services
   * @param {any} validator Joi validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImagesHandler = this.postUploadImagesHandler.bind(this);
  }

  /**
   * Create image upload handler
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Response image when success upload
   */
  async postUploadImagesHandler(request, h) {
    const {data} = request.payload;
    const {uploadValidator} = this._validator;

    uploadValidator.validateUploadHeadersSchema(data.hapi.headers);

    const filename =
      await this._service.uploadService.uploadFile(data, data.hapi);

    return h.response({
      status: 'success',
      message: 'Gambar berhasil diunggah',
      data: {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/${filename}`,
      },
    }).code(201);
  }
}

module.exports = {UploadImagesHandler};
