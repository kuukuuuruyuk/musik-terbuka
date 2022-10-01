/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumns('songs', {
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('songs', ['created_at', 'updated_at']);
};
