"use strict";

import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class List extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    this.belongsToMany(models.Tags, {
      foreignKey: "listId",
      through: "ListTags",
    });
    this.belongsTo(models.User, {
      foreignKey: "userId",
    });
  }
}
List.init(
  {
    listId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    listName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    access: {
      type: DataTypes.ENUM("public", "private"),
      allowNull: false,
      defaultValue: "private",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "List",
  }
);

export default List;
