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
    const {payload} = request;
    const {userValidator} = this._validator;

    userValidator.validateUserPayload(payload);

    const {userService} = this._service;
    const userId = await userService.storeUser(payload);

    const _response = h.response({
      status: 'success',
      data: {userId},
    });

    _response.code(201);
    return _response;
  }
}

module.exports = {UserHandler};
