/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'varchar(60)',
      primaryKey: true,
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    owner: {
      type: 'text',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
  });

  pgm.createIndex('playlists', 'owner');
};

exports.down = (pgm) => {
  pgm.dropIndex('playlists', 'owner');
  pgm.dropTable('playlists');
};
