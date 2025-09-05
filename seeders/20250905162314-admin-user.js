'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'admin',
        password: hashedPassword,
        name: 'Eddy',
        lastname: 'Ramos',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { username: 'admin' }, {});
  }
};