/**
 * Authentication handler
 */
class AuthenticationHandler {
  /**
   * Authenticaksi handler constructor
   * @param {any} service servis injeksi object
   * @param {any} validator validator dependensi injeksion
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
            this.deleteAuthenticationHandler.bind(this);
  }
  /**
   * Mengauthentikasi pennguna/login
   */
  postAuthenticationHandler() {}

  /**
   * Memperbaharui akses token
   */
  putAuthenticationHandler() {}

  /**
   * Menghpaus authentikasi
   */
  deleteAuthenticationHandler() {}
}

module.exports = {AuthenticationHandler};
