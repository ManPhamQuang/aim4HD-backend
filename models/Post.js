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
        message: "Aiming must be HD, DI, PA, or CR",
      },
    },
    currentMember: Number,
    maximumMember: Number,
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
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.pre(/^find/, function (next) {
  this.find({
    isOpen: {
      $ne: false,
    },
  });
  next();
});

module.exports = new mongoose.model("Post", postSchema);
