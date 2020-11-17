const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: String,
    school: {
      type: mongoose.Types.ObjectId,
      ref: "School",
    },
  },
  {
    toJSON: true,
    toObject: true,
  }
);

module.exports = new mongoose.model("Course", courseSchema);
