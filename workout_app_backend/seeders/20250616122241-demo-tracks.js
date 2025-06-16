"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Tracks", [
      {
        url: "https://audiocdn.epidemicsound.com/lqmp3/01JH0913MHCHBCPAZPBQS3CZBY.mp3",
        type: "mp3",
        imgUrl:
          "https://cdn.epidemicsound.com/curation-assets/commercial-release-cover-images/14148/3000x3000.jpg?format=webp&width=320&height=320&quality=80",
        userId: null,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "youtube",
        imgUrl:
          "https://i1.sndcdn.com/artworks-x8zI2HVC2pnkK7F5-4xKLyA-t1080x1080.jpg",
        userId: null,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tracks", null, {});
  },
};
