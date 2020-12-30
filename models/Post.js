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
    appliedStudents: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    approvedMembers: {
      type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
      select: false,
    },
    numberOfComments: { type: Number, default: 0 },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = new mongoose.model("Post", postSchema);
