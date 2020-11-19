const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = new mongoose.model("School", SchoolSchema);
