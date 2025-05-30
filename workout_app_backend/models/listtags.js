"use strict";

import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class ListTags extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    this.belongsTo(models.Tags, {
      foreignKey: "tagId",
    });
    this.belongsTo(models.List, {
      foreignKey: "listId",
    });
  }
}
ListTags.init(
  {
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "ListTags",
  }
);

export default ListTags;
