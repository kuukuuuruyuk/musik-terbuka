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
  const {response: _r} = request;

  if (_r instanceof Error) {
    console.log(_r);
    if (_r instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: _r.message,
      }).code(_r.statusCode);
    }

    if (_r instanceof NotFoundError) {
      return h.response({
        status: 'error',
        message: _r.message,
      }).code(404);
    }

    if (_r instanceof AuthorizationError) {
      return h.response({
        status: 'error',
        message: _r.message,
      }).code(403);
    }

    if (_r instanceof AuthenticationError) {
      return h.response({
        status: 'error',
        message: _r.message,
      }).code(401);
    }

    if (_r instanceof InvariantError) {
      const {statusCode} = _r.output;

      return h.response({
        status: 'error',
        message: _r.message,
      }).code(statusCode);
    }

    if (!_r.isServer) {
      return h.continue;
    }

    return h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server.',
    }).code(500);
  }

  return h.continue || _r;
}

module.exports = {errorView};
