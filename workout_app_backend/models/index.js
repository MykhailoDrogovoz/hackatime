import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import { fileURLToPath } from "url";
import sequelize from "../util/db.js";
import User from "./user.js";
import List from "./list.js";
import ListTags from "./listtags.js";
import Tags from "./tags.js";
import UserExercise from "./userexercise.js";
import Game from "./games.js";
import UserGame from "./usergame.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

db.User = User;
db.List = List;
db.ListTags = ListTags;
db.Tags = Tags;
db.UserExercise = UserExercise;
db.Game = Game;
db.UserGame = UserGame;

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
