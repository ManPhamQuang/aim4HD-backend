const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Feedback must belong to an author"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Feedback must target a user"],
    },
    comment: String,
    isAnonymous: { type: Boolean, default: false },
    isRecommended: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = new mongoose.model("Feedback", feedbackSchema);
