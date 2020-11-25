const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator(input) {
          return /^[a-zA-Z0-9._%+-]+@rmit.edu\.vn$/.test(input);
        },
        message: "Please use RMIT email to login",
      },
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: { type: String, required: [true, "Description is required"] },
    studentNumber: {
      type: String,
      required: [true, "Student Number is required"],
    },
    avatar: {
      type: String,
      default: "default.png",
    },
    school: {
      type: String,
      enum: {
        values: ["SCD", "SBM", "SST"],
        message: "School must be SCD, SBM, or SST",
      },
    },
    major: {
      type: String,
      required: [true, "Major is required"],
    },
    numberOfRecommended: {
      type: Number,
      default: 0,
    },
    skills: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Skill",
      },
    ],
    currentCourse: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = new mongoose.model("User", userSchema);
