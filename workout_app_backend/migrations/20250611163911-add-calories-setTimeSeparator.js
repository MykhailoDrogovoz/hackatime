"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tags", "calories", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("Tags", "totalSeconds", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("Tags", "secondsPerSet", {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    });
    await queryInterface.changeColumn("Tags", "totalSets", {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tags", "calories");
    await queryInterface.removeColumn("Tags", "totalSeconds");
    await queryInterface.removeColumn("Tags", "secondsPerSet");
  },
};
