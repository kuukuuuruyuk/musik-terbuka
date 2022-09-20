/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'varchar(60)',
      primaryKey: true,
    },
    title: {
      type: 'varchar(255)',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    performer: {
      type: 'text',
      notNull: true,
    },
    genre: {
      type: 'text',
      notNull: true,
    },
    duration: {
      type: 'integer',
    },
    album_id: {
      type: 'text',
      references: '"albums"',
    },
  });

  pgm.createIndex('songs', 'album_id');
};

exports.down = (pgm) => {
  pgm.dropIndex('songs', 'album_id');
  pgm.dropTable('songs');
};
