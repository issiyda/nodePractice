'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.bulkInsert('users', [{
     name: 'ishida',
     email: "ishida@gmail.com",
     password: "aaaaaaaaa",
     type: 1,
     createdAt: new Date(),
     updatedAt: new Date()
  }
  ])
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  }
};
