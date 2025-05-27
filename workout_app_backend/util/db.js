require("dotenv").config();

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "workout_app",
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
  }
);

module.exports = sequelize;
