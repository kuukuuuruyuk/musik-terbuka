/**
 * Api plugin authentication
 */
class AuthenticationHandler {
  /**
   * Authentication handler
   *
   * @param {any} service Authentication services
   * @param {any} validator Joi validator
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
   *
   * @param {any} request Request payload
   * @param {any} h Hapi handler
   */
  async postAuthenticationHandler(request, h) {
    const authValidator = this._validator.authValidator;

    authValidator.validatePostAuthPayload(request.payload);

    const {username, password} = request.payload;
    const userId =
      await this._service.userService.userCrendential(username, password);
    const [accessToken, refreshToken] = await Promise.all([
      this._service.tokenManager.generateAccessToken({id: userId}),
      this._service.tokenManager.generateRefreshToken({id: userId}),
    ]);

    await this._service.authService.storeToken({
      accessToken,
      refreshToken,
      userId,
    });

    return h.response({
      status: 'success',
      message: 'Autentikasi berhasil!',
      data: {accessToken, refreshToken},
    }).code(201);
  }

  /**
   * Memperbaharui akses token
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Authentication data
   */
  async putAuthenticationHandler(request, h) {
    this._validator.authValidator.validatePutAuthPayload(request.payload);

    const refreshToken = request.payload?.refreshToken;

    await this._service.authService.verifyRefreshToken(refreshToken);

    const token = this._service.tokenManager.verifyRefreshToken(refreshToken);
    const createAccessToken =
      await this._service.tokenManager.generateAccessToken({id: token?.id});

    return h.response({
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken: createAccessToken,
      },
    });
  }

  /**
   * Menghpaus authentikasi
   *
   * @param {Request} request Request payload
   * @param {any} h Hapi handler
   * @return {any} Authenticaion data
   */
  async deleteAuthenticationHandler(request, h) {
    this._validator.authValidator.validateDeleteAuthPayload(request.payload);

    const refreshToken = request.payload?.refreshToken;

    await this._service.tokenManager.verifyRefreshToken(refreshToken);
    await this._service.authService.deleteRefreshToken(refreshToken);

    return h.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  }
}

module.exports = {AuthenticationHandler};
