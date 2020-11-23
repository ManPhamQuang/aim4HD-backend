const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  content: { type: String, required: [true, "Content is required"] },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = new mongoose.model("comment", commentSchema);
