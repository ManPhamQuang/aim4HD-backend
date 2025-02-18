const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        name: String,
        code: String,
        school: {
            type: mongoose.Types.ObjectId,
            ref: "School",
        },
        credit: Number,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = new mongoose.model("Course", courseSchema);
