const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: String,
  school: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
});

module.exports = new mongoose.model("Course", courseSchema);
