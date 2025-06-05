import { Model, DataTypes } from "sequelize";
import sequelize from "../util/db.js";

class UserExercise extends Model {
  static associate(models) {
    // Define associations here
    this.belongsTo(models.User, {
      foreignKey: "userId",
    });
    this.belongsTo(models.Tags, {
      foreignKey: "tagId",
    });
  }
}

UserExercise.init(
  {
    userExerciseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    setsCompleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "UserExercise",
  }
);

export default UserExercise;
