"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tags", "totalSets", {
      type: Sequelize.INTEGER,
      defaultValue: 30, // Default sets for each exercise
      allowNull: false,
    });

    await queryInterface.addColumn("Tags", "coins", {
      type: Sequelize.INTEGER,
      defaultValue: 3, // Default coins for each exercise
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tags", "totalSets");
    await queryInterface.removeColumn("Tags", "coins");
  },
};
