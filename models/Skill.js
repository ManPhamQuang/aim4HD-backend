const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
    {
        name: String,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = new mongoose.model("Skill", skillSchema);
