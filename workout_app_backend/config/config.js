import dotenv from "dotenv";

dotenv.config();

export default {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    ssl: true,
    port: process.env.DB_PORT,
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    ssl: true,
    port: process.env.DB_PORT,
  },
};

// const dotenv = require("dotenv");
// dotenv.config();

// module.exports = {
//   development: {
//     username: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
//     host: process.env.DATABASE_HOST,
//     dialect: process.env.DATABASE_DIALECT,
//     ssl: true,
//     port: process.env.DB_PORT,
//   },
//   production: {
//     username: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
//     host: process.env.DATABASE_HOST,
//     dialect: process.env.DATABASE_DIALECT,
//     ssl: true,
//     port: process.env.DB_PORT,
//   },
// };
