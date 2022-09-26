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
  const {response: _response} = request;

  if (_response instanceof Error) {
    console.log(_response);
    if (_response instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: _response.message,
      }).code(_response.statusCode);
    }

    if (_response instanceof NotFoundError) {
      return h.response({
        status: 'error',
        message: _response.message,
      }).code(404);
    }

    if (_response instanceof AuthorizationError) {
      return h.response({
        status: 'error',
        message: _response.message,
      }).code(403);
    }

    if (_response instanceof AuthenticationError) {
      return h.response({
        status: 'error',
        message: _response.message,
      }).code(401);
    }

    if (_response instanceof InvariantError) {
      const {statusCode} = _response.output;

      return h.response({
        status: 'error',
        message: _response.message,
      }).code(statusCode);
    }

    if (!_response.isServer) {
      return h.continue;
    }

    return h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server.',
    }).code(500);
  }

  return h.continue || _response;
}

module.exports = {errorView};
