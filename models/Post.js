const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "A post must belong to a user"],
    },
    title: {
      type: String,
      required: [true, "A post must have a title"],
    },
    content: {
      type: String,
      required: [true, "A post must have a content"],
    },
    aiming: {
      type: String,
      enum: {
        values: ["HD", "DI", "PA", "CR"],
      },
    },
    currentMember: Number,
    maximumMember: Number,
    course: {
      type: String,
      required: [true, "A course is required"],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    requiredSkills: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Skill",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = new mongoose.model("Post", postSchema);
