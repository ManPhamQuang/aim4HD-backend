const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

exports.USER_TYPES = {
    CONSUMER: "consumer",
    SUPPORT: "support",
};

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
        description: { type: String },
        studentNumber: {
            type: String,
            required: [true, "Student Number is required"],
        },
        avatar: {
            type: String,
            default:
                "https://res.cloudinary.com/dybygufkr/image/upload/c_thumb,w_200,g_face/v1593000869/avatar_q2ysxd.jpg",
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
        currentCourses: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Course",
            },
        ],
        type: String,
        savedPosts: {
            type: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
            default: [],
        },
        microsoftUniqueId: { type: String, select: false },
        pastCoursesGrades: [
            new mongoose.Schema(
                {
                    course: {
                        type: mongoose.Types.ObjectId,
                        ref: "Course",
                        required: true,
                    },
                    grade: {
                        type: String,
                        required: true,
                        enum: {
                            values: ["HD", "DI", "CR", "PA", "NN"],
                            message: "must be either HD, DI, CR, PA ,NN",
                        },
                    },
                },
                { _id: false }
            ),
        ],
        socialLinks: {
            type: new mongoose.Schema(
                {
                    facebook: String,
                    linkedin: String,
                    instagram: String,
                    github: String,
                },
                { _id: false }
            ),
            default: {},
        },
        chatrooms: [
            {
                type: mongoose.Types.ObjectId,
                ref: "ChatRoom",
            },
        ],

        achievements: [
            new mongoose.Schema(
                {
                    title: { type: String, required: true },
                    url: { type: String, required: true },
                },
                { _id: false, default: [] }
            ),
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.plugin(mongoose_fuzzy_searching, { fields: ["name"] });

module.exports = new mongoose.model("User", userSchema);
