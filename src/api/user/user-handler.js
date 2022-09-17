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
   * @param {Request} _request request body
   * @param {any} h hapi server handler
   * @return {any}; return json
   */
  postUserHandler(_request, h) {
    return h.response({
      status: 'Success',
    });
  }
}

module.exports = {UserHandler};
