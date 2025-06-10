"use strict";
import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";
class UserGame extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
    });
    this.belongsTo(models.Game, {
      foreignKey: "id",
    });
  }
}
UserGame.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserGame",
  }
);

export default UserGame;
