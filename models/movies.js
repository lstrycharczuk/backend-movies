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
    type: String,
    default: "TBA",
  },
  watched: {
    type: Boolean,
    default: false,
  },
});

const Movies = mongoose.model("Movies", movieSchema);
const moviesRouter = express.Router();

const path = "/movies";

moviesRouter.get(path, async (req, resp) => {
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

moviesRouter.post(path, async (req, resp) => {
  const movie = new Movies({
    title: req.body.title,
  });
  try {
    const newMovie = await movie.save();
    resp.status(201).json(newMovie);
  } catch (err) {
    resp.status(400).json({ message: err.message });
  }
});

moviesRouter.get(`${path}/:id`, async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id);
    if (movie == null) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

moviesRouter.put(`${path}/:id`, async (req, res) => {
  try {
    const updateData = req.body
    const movie = await Movies.findByIdAndUpdate(req.params.id, updateData);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

moviesRouter.delete(`${path}/:id`, async (req, res) => {
  try {
    const movie = await Movies.findByIdAndDelete(req.params.id);
    if (movie == null) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = moviesRouter;
