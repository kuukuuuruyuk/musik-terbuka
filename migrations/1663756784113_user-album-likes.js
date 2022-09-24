/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'varchar(60)',
      primaryKey: true,
    },
    user_id: {
      type: 'text',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    album_id: {
      type: 'text',
      notNull: true,
      references: '"albums"',
      onDelete: 'cascade',
    },
  });

  pgm.createIndex('user_album_likes', ['user_id', 'album_id']);
};

exports.down = (pgm) => {
  pgm.dropIndex('user_album_likes', ['user_id', 'album_id']);
  pgm.dropTable('user_album_likes');
};
