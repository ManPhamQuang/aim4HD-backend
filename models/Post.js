const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

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
        closedAt: {
            type: Date,
            select: false,
        },
        course: {
            type: mongoose.Types.ObjectId,
            ref: "Course",
        },
        appliedStudents: {
            type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
            select: false,
        },
        approvedMembers: {
            type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
        },
        numberOfComments: { type: Number, default: 0 },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

postSchema.plugin(mongoose_fuzzy_searching, {
    fields: [
        { name: "title", minSize: 2, weight: 5 },
        { name: "aiming", minSize: 2, weight: 2 },
        { name: "content", minSize: 4, prefixOnly: true, weight: 1 },
    ],
});

module.exports = new mongoose.model("Post", postSchema);
