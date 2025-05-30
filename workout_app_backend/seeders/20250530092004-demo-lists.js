"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "Lists",
      [
        {
          listName: "Full Body Beginner",
          description: "A beginner routine covering major muscle groups.",
          createdAt: now,
          updatedAt: now,
        },
        {
          listName: "Core Strength",
          description: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          listName: "HIIT Blast",
          description: "High-intensity interval training to burn fat fast.",
          createdAt: now,
          updatedAt: now,
        },
        {
          listName: "Upper Body Focus",
          description: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Lists", null, {});
  },
};
