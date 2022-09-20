/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'varchar(60)',
      primaryKey: true,
    },
    username: {
      type: 'varchar(150)',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'text',
      notNull: true,
    },
    fullname: {
      type: 'varchar(255)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
