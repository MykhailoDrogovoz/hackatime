"use strict";

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Games",
      [
        {
          name: "Roulette",
          coin_cost: 100,
          iconClass: "fas fa-bullseye",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dice",
          coin_cost: 50,
          iconClass: "fas fa-dice",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Randomizer",
          coin_cost: 0,
          iconClass: "fas fa-random",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Card",
          coin_cost: 75,
          iconSymbol: "&#127136;",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Games", null, {});
  },
};
