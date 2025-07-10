"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Lists", "deletedUser", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
    await queryInterface.changeColumn("Lists", "userId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "userId",
      },
      allowNull: true,
    });
    await queryInterface.addColumn("Users", "seenNoListTour", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
    await queryInterface.addColumn("Users", "seenHasListTour", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
    await queryInterface.addColumn("Users", "seenOptionsTour", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Lists", "deletedUser");
    await queryInterface.removeColumn("Users", "seenNoListTour");
    await queryInterface.removeColumn("Users", "seenHasListTour");
    await queryInterface.removeColumn("Users", "seenOptionsTour");
    await queryInterface.changeColumn("Lists", "userId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "userId",
      },
      allowNull: false,
    });
  },
};
