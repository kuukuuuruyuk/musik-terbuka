/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
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
      type: 'varchar(255)',
      notNull: true,
      references: '"songs"',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'text',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    action: {
      type: 'text',
    },
    time: {
      type: 'timestamp',
    },
  });

  pgm.createIndex('playlist_song_activities', [
    'playlist_id',
    'song_id',
    'user_id',
  ]);
};

exports.down = (pgm) => {
  pgm.dropIndex('playlist_song_activities', [
    'playlist_id',
    'song_id',
    'user_id',
  ]);
  pgm.dropTable('playlist_song_activities');
};
