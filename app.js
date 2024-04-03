const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const moviesRouter = require("./models/movies");
const port = process.env.PORT || 3000;
require("dotenv").config();

const connectToDatabase = () => {
  const mongoose = require("mongoose");
  mongoose.connect(process.env.MONGO_DB);
};
connectToDatabase();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", moviesRouter);

app.get("/", (req, resp) => {
  resp.send(
    `<h1>Welcome to the Movie API</h1><p>Check out our <a href='https://github.com/lstrycharczuk/backend-movies'>GitHub Repo</a>`
  );
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
