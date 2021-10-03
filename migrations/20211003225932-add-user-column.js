'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
    await queryInterface.addColumn('users', "password", { 
      type: Sequelize.STRING,
      after: "email"
    }),
    await queryInterface.addColumn('users', "type",  { 
      type: Sequelize.INTEGER,
      after: "password"
    })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
    await queryInterface.removeColumn('users', "password", Sequelize.STRING),
    await queryInterface.removeColumn('users', "type", Sequelize.INTEGER)
    ])
  }
};
