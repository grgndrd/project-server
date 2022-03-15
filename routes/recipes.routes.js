const router = require("express").Router();
const mongoose = require("mongoose");

const Recipe = require("../models/Recipe.model");

router.post("/recipes/create", (req, res, next) => {
  const { chef, title, description, comments } = req.body;

  Recipe.create({ chef, title, description, comments })
    .then((response) => res.json(response))
    .catch((err) => next(err));
});

router.get("/recipes", (req, res, next) => {
  Recipe.find()
    .populate("chef")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
    })
      .then((response) => res.json(response)) 
  
    .catch((err) => res.json(err));
});

router.get("/recipes/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }
  console.log(recipeId);
  Recipe.findById({})
    .populate("chef")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
    })
    .then((response) => {
      console.log(response);
      res.json(response);
    })

    .catch((err) => res.json(err));
});

router.put("/recipes/:recipeId", (req, res, next) => {
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
