"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    coins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    calories: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    totalTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    musicUnlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    customMusicUnlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    customListsUnlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },

  {
    sequelize,
    modelName: "User",
  }
);

export default User;
