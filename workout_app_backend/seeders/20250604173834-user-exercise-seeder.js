"use strict";
import moment from "moment";
import models from "../models/index.js"; // Correctly importing models

export default {
  async up(queryInterface, Sequelize) {
    // Fetch all users and tags from the database
    const users = await models.User.findAll();
    const tags = await models.Tags.findAll();

    const userExercises = [];

    // Generate UserExercise entries for each user and tag combination
    users.forEach((user) => {
      tags.forEach((tag) => {
        userExercises.push({
          userId: user.userId,
          tagId: tag.tagId,
          setsCompleted: Math.floor(Math.random() * 5),
          completedAt: moment().toDate(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    // Insert the records into the UserExercises table
    await queryInterface.bulkInsert("UserExercises", userExercises, {});
  },

  async down(queryInterface, Sequelize) {
    // Rollback: delete all records from UserExercises table
    await queryInterface.bulkDelete("UserExercises", null, {});
  },
};
