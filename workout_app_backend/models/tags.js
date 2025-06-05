"use strict";

import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class Tags extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    this.belongsToMany(models.List, {
      foreignKey: "tagId",
      through: "ListTags",
    });
  }
}
Tags.init(
  {
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalSets: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
      allowNull: false,
    },
    coins: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Tags",
  }
);
export default Tags;
