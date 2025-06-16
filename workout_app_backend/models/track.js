"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";
class Track extends Model {
  static associate(models) {
    Track.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}

Track.init(
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["mp3", "youtube"]],
      },
    },
    imgUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Track",
    timestamps: true,
  }
);

export default Track;
