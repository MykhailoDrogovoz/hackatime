"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class UserStats extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
    });
  }
}

UserStats.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    calories: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "UserStats",
    tableName: "UserStats",
    timestamps: false,
  }
);

export default UserStats;
