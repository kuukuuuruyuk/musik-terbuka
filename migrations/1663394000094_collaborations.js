/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
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
    user_id: {
      type: 'text',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
  });

  pgm.createIndex('collaborations', ['playlist_id', 'user_id']);
};

exports.down = (pgm) => {
  pgm.dropIndex('collaborations', ['playlist_id', 'user_id']);
  pgm.dropTable('collaborations');
};
