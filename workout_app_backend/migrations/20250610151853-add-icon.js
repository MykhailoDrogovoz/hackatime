"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Games", "iconClass", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Games", "iconSymbol", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Games", "iconClass");
    await queryInterface.removeColumn("Games", "iconSymbol");
  },
};
