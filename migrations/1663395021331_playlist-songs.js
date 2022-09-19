/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'varchar(60)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'text',
      notNull: true,
      references: '"playlists"',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'text',
      notNull: true,
      references: '"songs"',
      onDelete: 'cascade',
    },
  });

  pgm.createIndex('playlist_songs', ['playlist_id', 'song_id']);
};

exports.down = (pgm) => {
  pgm.dropIndex('playlist_songs', ['playlist_id', 'song_id']);
  pgm.dropTable('playlist_songs');
};
