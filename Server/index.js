const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const port = 4000;

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL);
const conn = mongoose.connection;

conn.once("open", () => {
  console.log("Database connected successfully");
});
conn.on("error", (error) => {
  console.error("Error connecting to database:", error);
  process.exit();
});

const usersRoutes = require("./routes/usersRouter");
const tasksRoutes = require("./routes/tasksRouter");

app.use(usersRoutes);
app.use(tasksRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
