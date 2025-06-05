"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "coins", {
      type: Sequelize.INTEGER,
      defaultValue: 0, // Default value for new users
      allowNull: false, // Coins cannot be NULL
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "coins");
  },
};
