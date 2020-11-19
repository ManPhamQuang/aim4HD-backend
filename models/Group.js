const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = new mongoose.model("Group", groupSchema);
