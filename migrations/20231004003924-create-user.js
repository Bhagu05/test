'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Make sure to define this as the primary key
        autoIncrement: true, // If you want auto-increment behavior
      },
 
      first_name: { // Change 'name' to 'first_name'
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: { // Add 'last_name' field
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
 
    
    });
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
