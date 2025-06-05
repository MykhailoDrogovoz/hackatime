"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("UserExercises", "totalSets");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("UserExercises", "totalSets", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3,
    });
  },
};
