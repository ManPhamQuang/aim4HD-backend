const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Feedback must target a user"],
    },
  ],
});

module.exports = new mongoose.model("Group", groupSchema);
