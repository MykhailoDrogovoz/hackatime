"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn("Users", "firstName", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("Users", "lastName", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("Users", "email", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
      queryInterface.changeColumn("Users", "username", {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
      queryInterface.addColumn("Users", "password", {
        type: Sequelize.CHAR,
        allowNull: false,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
