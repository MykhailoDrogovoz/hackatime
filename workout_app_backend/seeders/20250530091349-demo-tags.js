"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "Tags",
      [
        { name: "Push-up", createdAt: now, updatedAt: now },
        { name: "Crunch", createdAt: now, updatedAt: now },
        { name: "Squat", createdAt: now, updatedAt: now },
        { name: "Lunge", createdAt: now, updatedAt: now },
        { name: "Plank", createdAt: now, updatedAt: now },
        { name: "Burpee", createdAt: now, updatedAt: now },
        { name: "Mountain Climber", createdAt: now, updatedAt: now },
        { name: "Jumping Jack", createdAt: now, updatedAt: now },
        { name: "Deadlift", createdAt: now, updatedAt: now },
        { name: "Pull-up", createdAt: now, updatedAt: now },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tags", null, {});
  },
};
