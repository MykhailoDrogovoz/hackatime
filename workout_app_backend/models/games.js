"use strict";

import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js"; // Adjust path if necessary

class Game extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Example of possible associations (if any) can be defined here.
    // This is just a placeholder if you want to define future relationships.
    // e.g., this.belongsTo(models.User, { foreignKey: "userId" });
  }
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coin_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    iconClass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iconSymbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Game",
    tableName: "Games",
    timestamps: true,
  }
);

export default Game;
