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
    const {payload} = request;

    this._validator.authValidator.validatePostAuthPayload(payload);

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

    return h.response({
      status: 'success',
      message: 'Autentikasi berhasil!',
      data: {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      },
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
    const {payload} = request;

    this._validator.authValidator.validatePutAuthPayload(payload);

    const {refreshToken} = payload;
    const {
      authService,
      tokenManager: _tokenManager,
    } = this._service;

    await authService.verifyToken(refreshToken);

    const {id} = await _tokenManager.verifyRefreshToken(refreshToken);
    const jwtAccessToken = await _tokenManager.generateAccessToken({id});

    return h.response({
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {accessToken: jwtAccessToken},
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
    const {payload} = request;

    this._validator.authValidator.validateDeleteAuthPayload(payload);

    const {refreshToken} = payload;
    const {
      authService,
      tokenManager: _tokenManager,
    } = this._service;

    await _tokenManager.verifyRefreshToken(refreshToken);
    await authService.deleteToken(refreshToken);

    return h.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  }
}

module.exports = {AuthenticationHandler};
