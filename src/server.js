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
  const hapiServer = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {cors: {origin: ['*']}},
  });

  // Regis eksternal plugin
  await hapiServer.register([
    {plugin: hapiAuthJwt},
    {plugin: inert},
  ]);

  // Mendefinisikan strategy autentikasi jwt
  hapiServer.auth.strategy(JWT_APP_KEY, 'jwt', {
    keys: config.token.accessToken,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.token.tokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // App server
  await appServer(hapiServer);

  // Starting server
  await hapiServer.start();

  // Show info server on app run
  console.log({i: `Server berjalan pada ${hapiServer.info.uri}`});
}

// Starting app
initServer();
