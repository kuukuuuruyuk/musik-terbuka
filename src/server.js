// menginpor dotend dan menjalankan konfigurasinya
require('dotenv').config();

const {Pool} = require('pg');
const Hapi = require('@hapi/hapi');

// Plugin api hapi server register
const api = require('./api');

const {AlbumService} = require('./service/album-service');
const {albumValidator} = require('./validator/album/album-validator');
const {SongService} = require('./service/song-service');
const {songValidator} = require('./validator/song/song-validator');

/**
 * Method for handle starting the app
 */
async function bootstrap() {
  const {albumApi, songApi} = api();
  const pool = new Pool();
  const albumService = new AlbumService(pool);
  const songService = new SongService(pool);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {origin: ['*']},
    },
  });

  await server.register([
    {
      plugin: {...songApi},
      options: {
        service: {songService, albumService},
        validator: {songValidator, albumValidator},
      },
    },
    {
      plugin: {...albumApi},
      options: {
        service: {songService, albumService},
        validator: {songValidator, albumValidator},
      },
    },
  ]);

  await server.start();
  console.info(`Server berjalan pada ${server.info.uri} ${process.env.HOST}`);
}

// Starting app
bootstrap();
