const {ClientError} = require('../exception/client-error');

/**
 * Funtion for handle failed response
 * @param {Error} error
 * @param {any} server
 * @return {any} response web
 */
function failedWebResponse(error, server) {
  if (error instanceof ClientError) {
    const _response = server.response({
      status: 'fail',
      message: error.message,
    });

    _response.code(error.statusCode);
    return _response;
  }

  const _response = server.response({
    status: 'error',
    message: 'Sorry, there was a server failure!',
  });

  _response.code(500);
  return _response;
}

module.exports = {failedWebResponse};
