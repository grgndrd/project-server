const router = require("express").Router();

const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const Comment = require("../models/Comment.model");

// ****************************************************************************************
// POST route - create a comment of a specific post
// ****************************************************************************************

router.post("/recipes/:id/comment", (req, res, next) => {
  const { id } = req.params;
  const { author, content } = req.body;

  let user;

  User.findOne({ username: author })
    .then((userFromDb) => {
      user = userFromDb;

      if (!userFromDb) {
        return User.create({ username: author });
      }
    })
    .then((newUser) => {
      Recipe.findById(id).then((dbRecipe) => {
        let newComment;

        if (newUser) {
          newComment = new Comment({ author: newUser._id, content });
        } else {
          newComment = new Comment({ author: user._id, content });
        }

        newComment.save().then((dbComment) => {
          dbRecipe.comments.push(dbComment._id);

          dbRecipe
            .save()
            .then((updatedRecipe) => res.redirect(`/recipes/${updatedRecipe._id}`));
        });
      });
    })
    .catch((err) => next(err));
});

module.exports = router;
