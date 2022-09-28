// menginpor dotend dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const hapiAuthJwt = require('@hapi/jwt');
const inert = require('@hapi/inert');
const {appServer, JWT_APP_KEY} = require('./app');
const config = require('./utils/config');
/**
 * Method for handle starting the app
 */
async function initServer() {
  // Init config hapi server
  const _server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {origin: ['*']},
    },
  });

  // Regis eksternal plugin
  await _server.register([
    {plugin: hapiAuthJwt},
    {plugin: inert},
  ]);

  // Mendefinisikan strategy autentikasi jwt
  _server.auth.strategy(JWT_APP_KEY, 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // App server
  await appServer(_server);

  // Starting server
  await _server.start();

  // Show info server on app run
  console.log({
    i: `Server berjalan pada ${_server.info.uri}`,
  });
}

// Starting app
initServer();
