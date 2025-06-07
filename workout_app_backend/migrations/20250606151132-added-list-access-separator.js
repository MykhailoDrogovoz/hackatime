"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Lists", "access", {
      type: Sequelize.ENUM("public", "private"),
      allowNull: false,
      defaultValue: "private",
    });

    await queryInterface.addColumn("Lists", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "userId",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Lists", "access");
    await queryInterface.removeColumn("Lists", "userId");
  },
};
