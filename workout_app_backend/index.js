import express from "express";
import sequelize from "./util/db.js";
import bodyParser from "body-parser";
import cors from "cors";

import userRoutes from "./routes/user.js";
import listRoutes from "./routes/list.js";
import tagsRoutes from "./routes/tags.js";
import gameRoutes from "./routes/game.js";
import trackRoutes from "./routes/track.js";

const app = express();

app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.use("/user", userRoutes);
app.use("/lists", listRoutes);
app.use("/tags", tagsRoutes);
app.use("/games", gameRoutes);
app.use("/tracks", trackRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Database connection failed. Error: ", error);
  });

app.listen(3002, () => {
  console.log("Server is running on port http://localhost:3002");
});
