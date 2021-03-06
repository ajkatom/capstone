const conn = require('../conn');
const { Sequelize } = conn;
const { newBar } = require('../../automail');
const moment = require('moment');

const Bar = conn.define('bar',
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    email: Sequelize.STRING,
    password: {
      allowNull: false,
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    endOfMembershipDate: {
      type: Sequelize.STRING,
      defaultValue: moment().add(1, 'months').format('LL').toString()
    },
    latitude: Sequelize.STRING,
    longitude: Sequelize.STRING
  }, { underscored: true }
);

Bar.hook('afterCreate', (bar) => {
  newBar(bar)
});


module.exports = Bar;
