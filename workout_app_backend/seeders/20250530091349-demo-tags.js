"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Difficulty-based values
    const difficultyMap = {
      easy: { totalSets: 15, coins: 2 },
      medium: { totalSets: 30, coins: 3 },
      hard: { totalSets: 50, coins: 5 },
    };

    await queryInterface.bulkInsert(
      "Tags",
      [
        {
          name: "Push-up",
          totalSets: difficultyMap.medium.totalSets,
          coins: difficultyMap.medium.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Crunch",
          totalSets: difficultyMap.easy.totalSets,
          coins: difficultyMap.easy.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Squat",
          totalSets: difficultyMap.medium.totalSets,
          coins: difficultyMap.medium.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Lunge",
          totalSets: difficultyMap.medium.totalSets,
          coins: difficultyMap.medium.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Plank",
          totalSets: difficultyMap.hard.totalSets,
          coins: difficultyMap.hard.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Burpee",
          totalSets: difficultyMap.hard.totalSets,
          coins: difficultyMap.hard.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Mountain Climber",
          totalSets: difficultyMap.medium.totalSets,
          coins: difficultyMap.medium.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Jumping Jack",
          totalSets: difficultyMap.easy.totalSets,
          coins: difficultyMap.easy.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Deadlift",
          totalSets: difficultyMap.hard.totalSets,
          coins: difficultyMap.hard.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Pull-up",
          totalSets: difficultyMap.hard.totalSets,
          coins: difficultyMap.hard.coins,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tags", null, {});
  },
};
