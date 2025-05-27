const express = require("express");
const sequelize = require("./util/db");
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

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
