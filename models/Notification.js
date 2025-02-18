const mongoose = require("mongoose");

const actionValues = [
    "applied to your post",
    "applied to a post you're in",
    "approved your application",
    "uploaded a new post",
    "commented on your post",
    "commented on a post you're applied to",
    "commented on a post you're following",
    "sent a message",
];

const notificationSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Notification must belong to sender"],
        },
        receiver: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Notification must target at least 1 receiver"],
        },
        read: {
            type: Boolean,
            default: false,
        },
        action: {
            type: String,
            enum: {
                values: actionValues,
                message:
                    "action must be: " +
                    actionValues.forEach((action, idx) => {
                        if (idx == 0) {
                            return `${action}`;
                        } else {
                            return `, ${action} `;
                        }
                    }),
            },
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        postLink: {
            type: mongoose.Types.ObjectId,
            ref: "Post",
            required: [true, "Notification must have a linked post"],
        },
        content: String,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = new mongoose.model("Notification", notificationSchema);
