"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Difficulty-based values
    const difficultyMap = {
      easy: { totalSets: 15, totalSeconds: 20, totalSecondsSets: 4, coins: 2 },
      medium: {
        totalSets: 30,
        totalSeconds: 40,
        totalSecondsSets: 3,
        coins: 3,
      },
      hard: { totalSets: 50, totalSeconds: 60, totalSecondsSets: 2, coins: 5 },
    };

    await queryInterface.bulkInsert(
      "Tags",
      [
        {
          name: "Push-up",
          totalSets: difficultyMap.medium.totalSets, // 30 sets for daily routine (medium difficulty)
          secondsPerSet: 2, // Push-ups take 2 seconds per rep
          calories: 0.3, // ~0.3 calories per push-up (estimate)
          coins: difficultyMap.medium.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Crunch",
          totalSets: difficultyMap.easy.totalSets, // 15 sets for Crunch (easy difficulty)
          secondsPerSet: 3, // Crunch takes 3 seconds per rep
          calories: 0.4, // ~0.4 calories per crunch (estimate)
          coins: difficultyMap.easy.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Squat",
          totalSets: difficultyMap.medium.totalSets, // 30 sets for Squats (medium difficulty)
          secondsPerSet: 3, // Squats take 3 seconds per rep
          calories: 0.5, // ~0.5 calories per squat (estimate)
          coins: difficultyMap.medium.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Lunge",
          totalSets: difficultyMap.medium.totalSets, // 30 sets for Lunges (medium difficulty)
          secondsPerSet: 4, // Lunges take 4 seconds per rep
          calories: 0.7, // ~0.7 calories per lunge (estimate)
          coins: difficultyMap.medium.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Plank",
          totalSets: difficultyMap.hard.totalSecondsSets, // 50 sets for Plank (hard difficulty)
          totalSeconds: difficultyMap.hard.totalSeconds, // Plank hold for 60 seconds per set
          secondsPerSet: 1, // Hold each plank for 60 seconds
          calories: 2.0, // ~2 calories per minute of plank hold (estimate)
          coins: difficultyMap.hard.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Burpee",
          totalSets: difficultyMap.hard.totalSecondsSets, // 50 sets for Burpees (hard difficulty)
          totalSeconds: difficultyMap.hard.totalSeconds, // Burpee takes 20 seconds per set
          secondsPerSet: 1, // Burpee takes 20 seconds per set
          calories: 1.2, // ~1.2 calories per burpee (estimate)
          coins: difficultyMap.hard.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Mountain Climber",
          totalSets: difficultyMap.medium.totalSecondsSets, // 30 sets for Mountain Climbers (medium difficulty)
          totalSeconds: difficultyMap.medium.totalSeconds, // Mountain Climber takes 15 seconds per set
          secondsPerSet: 1, // Mountain Climber takes 15 seconds per set
          calories: 0.9, // ~0.9 calories per 15 seconds of mountain climber (estimate)
          coins: difficultyMap.medium.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Jumping Jack",
          totalSets: difficultyMap.easy.totalSecondsSets, // 15 sets for Jumping Jacks (easy difficulty)
          totalSeconds: difficultyMap.easy.totalSeconds, // Jumping Jack takes 10 seconds per set
          secondsPerSet: 1, // Jumping Jack takes 10 seconds per set
          calories: 0.5, // ~0.5 calories per jumping jack (estimate)
          coins: difficultyMap.easy.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Deadlift",
          totalSets: difficultyMap.hard.totalSets, // 50 sets for Deadlifts (hard difficulty)
          secondsPerSet: 6, // Deadlift takes 6 seconds per rep
          calories: 1.0, // ~1 calorie per deadlift (estimate)
          coins: difficultyMap.hard.coins,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Pull-up",
          totalSets: difficultyMap.hard.totalSets, // 50 sets for Pull-ups (hard difficulty)
          secondsPerSet: 4, // Pull-ups take 4 seconds per rep
          calories: 0.8, // ~0.8 calories per pull-up (estimate)
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
