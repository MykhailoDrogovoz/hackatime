import "../util/db.js";
import Game from "../models/games.js";
import User from "../models/user.js";
import UserGame from "../models/usergame.js";
import models from "../models/index.js";

class gameController {
  constructor() {}

  getGames = async (req, res) => {
    try {
      const game = await Game.findAll();

      if (!game) {
        return res.status(404).json({ message: "Games not found" });
      }

      res.status(200).json(game);
    } catch (err) {
      console.log("[Server]: Error getting lists", err);
      res
        .status(500)
        .json({ message: "Error getting lists", error: err.message });
    }
  };

  newGame = async (req, res) => {
    // Will add if it is nesseccary
  };

  deleteGame = async (req, res) => {
    // Will add if it is nesseccary
  };

  buyGame = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { gameName } = req.params;

      const game = await Game.findOne({
        where: {
          name: gameName,
        },
      });

      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userGame = await UserGame.findOne({
        where: {
          userId: userId,
          gameId: game.id,
        },
      });

      if (userGame) {
        return res.status(400).json({ message: "Game already bought" });
      }

      const newGame = await UserGame.create({
        userId: userId,
        gameId: game.id,
      });

      if (user.coins >= game.coin_cost) {
        user.coins -= game.coin_cost;
        await user.save();
        return res
          .status(200)
          .json({ message: "Game bought successfully", newGame });
      }

      return res.status(400).json({ message: "Not enough coins" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while completing the set." });
    }
  };

  getUserGames = async (req, res) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const userGames = await UserGame.findAll({
        where: {
          userId: userId,
        },
      });
      return res.status(200).json(userGames);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while getting user games." });
    }
  };
}

export const GameController = new gameController();
