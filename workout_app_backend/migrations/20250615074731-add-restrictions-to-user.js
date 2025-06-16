"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "customMusicUnlocked", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("Users", "customListsUnlocked", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("Users", "musicUnlocked", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "customMusicUnlocked");
    await queryInterface.removeColumn("Users", "customListsUnlocked");
    await queryInterface.removeColumn("Users", "musicUnlocked");
  },
};
