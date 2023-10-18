'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('assignment', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Make sure to define this as the primary key
        autoIncrement: true, // If you want auto-increment behavior
      },
      ass_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      num_of_attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: false, // Make sure to define this as the primary key
        autoIncrement: false, // If you want auto-increment behavior
      },

      }

    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
