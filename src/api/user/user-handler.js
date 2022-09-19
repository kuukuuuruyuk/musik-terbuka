const {failedWebResponse} = require('../../utils/web-response');

/**
 * User handler
 */
class UserHandler {
  /**
   * User handler constructor
   * @param {any} service servis injeksi dep
   * @param {any} validator validator injeki dependensi
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  /**
   * Menambahkan pengguna/user baru
   * @param {Request} request request body
   * @param {any} h hapi server handler
   * @return {any} return json
   */
  async postUserHandler(request, h) {
    try {
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
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }
}

module.exports = {UserHandler};
