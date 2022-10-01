const {ClientError} = require('../../exception/client-error');
const {NotFoundError} = require('../../exception/not-found-error');
const {AuthorizationError} = require('../../exception/authorization-error');
const {AuthenticationError} = require('../../exception/authentication-error');
const {InvariantError} = require('../../exception/invariant-error');

/**
 * On handle pre response for error
 *
 * @param {Request} request Request payload
 * @param {any} h Hapi handler
 * @return {any} Hapi response
 */
function errorView(request, h) {
  const response = request.response;

  if (response instanceof Error) {
    console.error(response);
    if (response instanceof ClientError) {
      const statusCode = response.statusCode;

      return h.response({
        status: 'fail',
        message: response.message,
      }).code(statusCode);
    }

    if (response instanceof NotFoundError) {
      return h.response({
        status: 'error',
        message: response.message,
      }).code(404);
    }

    if (response instanceof AuthorizationError) {
      return h.response({
        status: 'error',
        message: response.message,
      }).code(403);
    }

    if (response instanceof AuthenticationError) {
      return h.response({
        status: 'error',
        message: response.message,
      }).code(401);
    }

    if (response instanceof InvariantError) {
      const statusCode = response.statusCode;

      return h.response({
        status: 'error',
        message: response.message,
      }).code(statusCode);
    }

    if (!response.isServer) return h.continue;

    return h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server.',
    }).code(500);
  }

  return h.continue || response;
}

module.exports = {errorView};
