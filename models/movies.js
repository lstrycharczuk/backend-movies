const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "-",
  },
  year: {
    type: Number,
    default: "TBA",
  },
  watched: {
    type: Boolean,
    default: false,
  },
});

const Movies = mongoose.model("movies", movieSchema);
const moviesRouter = express.Router();

moviesRouter.get("/movies", async (req, resp) => {
  const perPage = parseInt(req.query.perPage) || 10;
  const page = Math.max(0, parseInt(req.query.page) || 0);

  try {
    const movies = await Movies.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec();
    const count = await Movies.countDocuments().exec();

    resp.json({
      movies,
      page: page,
      totalPages: Math.ceil(count / perPage),
    });
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
});

module.exports = moviesRouter;
