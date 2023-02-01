/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('products', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true
    },
    qty: {
      type: 'INTEGER',
      notNull: true
    },
    price: {
      type: 'INTEGER',
      notNull: true
    }
  })
}

exports.down = pgm => {}