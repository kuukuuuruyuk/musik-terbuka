/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('authentications', {
    id: {
      type: 'varchar(60)',
      primaryKey: true,
    },
    token: {
      type: 'text',
      notNull: true,
    },
    refresh_token: {
      type: 'text',
      notNull: true,
    },
    expire_date: {
      type: 'timestamp',
      notNull: true,
    },
    user_id: {
      type: 'text',
      references: '"users"',
    },
  });

  pgm.createIndex('authentications', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropIndex('authentications', 'user_id');
  pgm.dropTable('authentications');
};
