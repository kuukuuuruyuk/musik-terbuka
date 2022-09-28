/**
 * Api plugin user
 */
class UserHandler {
  /**
   * User handler
   *
   * @param {any} service User services
   * @param {any} validator Joi validator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  /**
   * Menambahkan pengguna/user baru
   *
   * @param {Request} request request payload
   * @param {any} h Hapi handler
   * @return {any} User data
   */
  async postUserHandler(request, h) {
    this._validator.userValidator.validateUserPayload(request.payload);

    return h.response({
      status: 'success',
      data: {
        userId: await this._service.userService.storeUser(request.payload),
      },
    }).code(201);
  }
}

module.exports = {UserHandler};
