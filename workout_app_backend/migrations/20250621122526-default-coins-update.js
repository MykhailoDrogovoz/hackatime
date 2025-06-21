"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "coins", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 300,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "coins", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: null,
    });
  },
};
