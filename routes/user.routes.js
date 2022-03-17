const router = require("express").Router();

const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

// ****************************************************************************************
// GET route to display the form to "register" a user
// ****************************************************************************************

router.get("/user-create", (req, res) => res.render("users/create"));

// ****************************************************************************************
// POST route to submit the form to create a user
// ****************************************************************************************

router.post("/user-create", (req, res) => {
  const { username } = req.body;
  User.findOne({ username })
    .then((userDocFromDB) => {
      if (!userDocFromDB) {
        // prettier-ignore
        User.create({ username })
        .then(() => res.redirect('/post-create'));
      } else {
        res.render("users/create", {
          message: "It seems you are already registered. ☀️",
        });
        return;
      }
    })
    .catch((err) => console.log(`Error while creating a new user: ${err}`));
});

// ****************************************************************************************
// GET route to display all users from the DB
// ****************************************************************************************

router.get("/users", (req, res) => {
  User.find() // <-- .find() method gives us always an ARRAY back
    .then((usersFromDB) => res.render("users/list", { users: usersFromDB }))
    .catch((err) =>
      console.log(`Error while getting users from the DB: ${err}`)
    );
});

router.put("/add-favorite", isAuthenticated, (req, res, next) => {
  const recipeObj = req.body;
  const user = req.payload;
  User.findByIdAndUpdate(user._id, {
    $push: { favoriteRecipes: recipeObj },
  })
    .then((updatedUser) => {
      console.log(updatedUser);
      res.json(updatedUser);
    })
    .catch((err) => console.log(err));
});

router.get("/favorites/:userId", (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((response) => {
      console.log(response);
      res.json(response.favoriteRecipes);
    })

    .catch((err) => res.json(err));
});

router.get("/favorites/:favoriteId", (req, res, next) => {
  const { favoriteId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(favoriteId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }
  console.log(favoriteId);
  Recipe.findById(favoriteId)
    .then((response) => {
      console.log(response);
      res.json(response);
    })

    .catch((err) => res.json(err));
});

router.put("/favorites/edit/:favoriteId", (req, res, next) => {
  const { favoriteId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(favoriteId)) {
    res.status(400).json({ message: "Specified Id is not valid" });
    return;
  }

  Recipe.findByIdAndUpdate(favoriteId, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.put("/favorites/:favoriteId", isAuthenticated, (req, res, next) => {
  const { favoriteId } = req.params;
  const user = req.payload;
  const recipeObj = req.body;

  console.log(recipeObj);
  
  User.findByIdAndUpdate(user._id, {
    $pull: { favoriteRecipes: recipeObj },
  })
    .then((updatedUser) => {
      console.log(updatedUser);
      res.json(updatedUser);
    })
    .catch((err) => console.log(err));
});
// ****************************************************************************************
// GET details of a specific user (primarily their posts)
// ****************************************************************************************

// ... your code here

module.exports = router;
