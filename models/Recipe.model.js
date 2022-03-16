const { Schema, model } = require("mongoose");

const recipeSchema = new Schema(
  {
    title: String,
    description: String,
    chef: { type: Schema.Types.ObjectId, ref: "User" },
    // comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
