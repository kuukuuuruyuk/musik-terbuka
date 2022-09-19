// menginpor dotend dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const hapiAuthJwt = require('@hapi/jwt');
const {appServer} = require('./app');

/**
 * Method for handle starting the app
 */
async function bootstrap() {
  // Init config hapi server
  const _server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {origin: ['*']},
    },
  });

  // Regis eksternal plugin
  await _server.register([
    {plugin: hapiAuthJwt},
  ]);

  // Mendefinisikan strategy autentikasi jwt
  _server.auth.strategy('musicterbuka_jwt', 'jwt', {
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
    i: `Server berjalan pada ${_server.info.uri} ${process.env.NODE_ENV}`,
  });
}

// Starting app
bootstrap();
