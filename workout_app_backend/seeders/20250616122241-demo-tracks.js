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
        url: "https://ia601302.us.archive.org/32/items/eminem-lose-yourself-radio-edit/EMINEM%20-%20Lose%20Yourself%20%28Radio%20Edit%29.mp3",
        type: "mp3",
        imgUrl:
          "https://m.media-amazon.com/images/I/51i4O6PHoUL._UF1000,1000_QL80_.jpg",
        userId: null,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "https://dn721806.ca.archive.org/0/items/03-stronger/01%20Good%20Morning.mp3",
        type: "mp3",
        imgUrl:
          "https://i1.sndcdn.com/artworks-iXdEDujhqre3qN0m-kHGIhw-t1080x1080.jpg",
        userId: null,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "https://www.youtube.com/watch?v=-tJYN-eG1zk&ab_channel=QueenOfficial",
        type: "youtube",
        imgUrl:
          "https://m.media-amazon.com/images/I/A1eZWdzpw2L._UF894,1000_QL80_.jpg",
        userId: null,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "https://www.youtube.com/watch?v=v2AC41dglnM&ab_channel=acdcVEVO",
        type: "youtube",
        imgUrl:
          "https://i1.sndcdn.com/artworks-000129437053-bgvku6-t1080x1080.jpg",
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
      {
        url: "https://www.youtube.com/watch?v=7vcArwDbe58",
        type: "youtube",
        imgUrl:
          "https://miro.medium.com/v2/resize:fit:500/1*UgkGwmA8phuBznyigYkn7A.jpeg",
        userId: null,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "https://www.youtube.com/watch?v=k1-TrAvp_xs&list=RDk1-TrAvp_xs&start_radio=1&ab_channel=RosaMusic",
        type: "youtube",
        imgUrl:
          "https://m.media-amazon.com/images/I/619pS489ytL._UF1000,1000_QL80_.jpg",
        userId: null,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: "https://www.youtube.com/watch?v=4Tr0otuiQuU&list=RD4Tr0otuiQuU&start_radio=1&ab_channel=andrearomano",
        type: "youtube",
        imgUrl:
          "https://m.media-amazon.com/images/I/518s+AO-41L._AC_UF894,1000_QL80_.jpg",
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
