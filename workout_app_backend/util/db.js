import dotenv from "dotenv";
dotenv.config();

import Sequelize from "sequelize";

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DATABASE_DIALECT,
  }
);

export default sequelize;
