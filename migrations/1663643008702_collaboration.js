/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: varchar(60),
      parimaryKey: true,
    },
    playlist_id: {
      type: 'text',
      notNull: true,
      references: '"playlists"',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'text',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
  });

  pgm.createIndex('collaborations', ['user_id', 'playlist_id']);
};

exports.down = (pgm) => {
  pgm.dropIndex('collaborations', ['user_id', 'playlist_id']);
  pgm.dropTable('collaborations');
};
