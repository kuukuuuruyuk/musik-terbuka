const {failedWebResponse} = require('../../utils/web-response');

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
   * @param {any} request Request body
   * @param {any} h Hapi handler server
   */
  async postAuthenticationHandler(request, h) {
    try {
      const {payload} = request;
      const {authValidator} = this._validator;

      authValidator.validatePostAuthPayload(payload);

      const {username, password} = payload;
      const {
        authService,
        userService,
        tokenManager: _tokenManager,
      } = this._service;
      const id = await userService.userCrendential(username, password);
      const userId = {id};
      const jwtAccessToken = await _tokenManager.generateAccessToken(userId);
      const jwtRefreshToken = await _tokenManager.generateRefreshToken(userId);

      await authService.storeToken({
        accessToken: jwtRefreshToken,
        refreshToken: jwtRefreshToken,
        userId: userId.id,
      });

      const _response = h.response({
        status: 'success',
        message: 'Autentikasi berhasil!',
        data: {
          accessToken: jwtAccessToken,
          refreshToken: jwtRefreshToken,
        },
      });

      _response.code(201);
      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Memperbaharui akses token
   * @param {Request} request Request body
   * @param {any} h Hapi server handler
   * @return {any}
   */
  async putAuthenticationHandler(request, h) {
    try {
      const {payload} = request;
      const {authValidator} = this._validator;

      authValidator.validatePutAuthPayload(payload);

      const {refreshToken} = payload;
      const {
        authService,
        tokenManager: _tokenManager,
      } = this._service;

      await authService.verifyToken(refreshToken);

      const {id} = await _tokenManager.verifyRefreshToken(refreshToken);
      const jwtAccessToken = await _tokenManager.generateAccessToken({id});

      const _response = h.response({
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {accessToken: jwtAccessToken},
      });

      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }

  /**
   * Menghpaus authentikasi
   * @param {Request} request Request body
   * @param {any} h Hapi handler server
   * @return {any}
   */
  async deleteAuthenticationHandler(request, h) {
    try {
      const {payload} = request;
      const {authValidator} = this._validator;

      authValidator.validateDeleteAuthPayload(payload);

      const {refreshToken} = payload;
      const {
        authService,
        tokenManager: _tokenManager,
      } = this._service;

      await _tokenManager.verifyRefreshToken(refreshToken);
      await authService.deleteToken(refreshToken);

      const _response = h.response({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      });

      return _response;
    } catch (error) {
      return failedWebResponse(error, h);
    }
  }
}

module.exports = {AuthenticationHandler};
