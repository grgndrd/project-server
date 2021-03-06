const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Recipe = require("../models/Recipe.model");

router.post("/recipes/create", isAuthenticated, (req, res, next) => {
  const user = req.payload;
  const { title, description } = req.body;

  Recipe.create({ chef: user._id, title, description })
    .then((response) => res.json(response))
    .catch((err) => next(err));
});

router.get("/recipes", (req, res, next) => {
  Recipe.find()
    // .populate("chef")
    // .populate({
    //   path: "comments",
    //   populate: {
    //     path: "author",
    //     model: "User",
    //   },
    // })
    .then((response) => {
      console.log(response);
      res.json(response);
    })

    .catch((err) => res.json(err));
});

router.get("/recipes-search", (req, res, next) => {
  Recipe.find()
    .then((response) => {
      console.log(response);
      res.json(response);
    })

    .catch((err) => res.json(err));
});

router.get("/recipes/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }
  console.log(recipeId);
  Recipe.findById(recipeId)
    .populate("chef")
    .then((response) => {
      console.log(response);
      res.json(response);
    })

    .catch((err) => res.json(err));
});

router.put("/recipes/edit/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Recipe.findByIdAndUpdate(recipeId, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.delete("/recipes/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }
  Recipe.findByIdAndRemove(recipeId)
    .then(() =>
      res.json({
        message: `Project with ${recipeId} was removed successfully`,
      })
    )
    .catch((err) => res.json(err));
});

module.exports = router;
