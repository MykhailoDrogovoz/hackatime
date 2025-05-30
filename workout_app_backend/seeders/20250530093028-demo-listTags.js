"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "ListTags",
      [
        // Full Body Beginner list includes Push-up, Squat, Plank
        { listId: 1, tagId: 1, createdAt: now, updatedAt: now }, // Push-up
        { listId: 1, tagId: 3, createdAt: now, updatedAt: now }, // Squat
        { listId: 1, tagId: 5, createdAt: now, updatedAt: now }, // Plank

        // Core Strength includes Crunch, Plank
        { listId: 2, tagId: 2, createdAt: now, updatedAt: now }, // Crunch
        { listId: 2, tagId: 5, createdAt: now, updatedAt: now }, // Plank

        // HIIT Blast includes Burpee, Mountain Climber, Jumping Jack
        { listId: 3, tagId: 6, createdAt: now, updatedAt: now }, // Burpee
        { listId: 3, tagId: 7, createdAt: now, updatedAt: now }, // Mountain Climber
        { listId: 3, tagId: 8, createdAt: now, updatedAt: now }, // Jumping Jack

        // Upper Body Focus includes Push-up, Pull-up, Deadlift
        { listId: 4, tagId: 1, createdAt: now, updatedAt: now }, // Push-up
        { listId: 4, tagId: 10, createdAt: now, updatedAt: now }, // Pull-up
        { listId: 4, tagId: 9, createdAt: now, updatedAt: now }, // Deadlift
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ListTags", null, {});
  },
};
