const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
  name: String,
});

module.exports = new mongoose.model("School", SchoolSchema);
