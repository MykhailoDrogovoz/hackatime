"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex("UserExercises", ["userId", "tagId"], {
      unique: true,
      name: "user_tag_unique_index",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("UserExercises", "user_tag_unique_index");
  },
};
