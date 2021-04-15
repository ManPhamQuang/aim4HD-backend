const User = require("../models/User");
const Skill = require("../models/Skill");
const Course = require("../models/Course");
const Notification = require("../models/Notification");
const catchAsync = require("../utils/catchAsync");
const ApiFeature = require("../utils/ApiFeature");
const AppError = require("../utils/appError");

const actionvalues = [
    "applied to post",
    "applied to a post you're in",
    "approved your application",
    "uploaded a new post",
    "commented on your post",
    "commented on a post you're applied to",
    "commented on a post you're following",
];

exports.getNotificationOfUser = catchAsync(async (req, res, next) => {
    const notifications = await Notification.find({ receiver: req.params.id });
    // .populate("sender")
    // .populate("receiver");

    if (!notifications)
        return next(
            new AppError("No notification was found with a given ID", 404)
        );
    res.status(200).json({ status: "sucess", data: { notifications } });
});

exports.createNotification = catchAsync(async (req, res, next) => {
    const sender = await User.findById(req.body.sender);
    const receiver = await User.findById(req.body.receiver);
    const action = req.body.action;
    // res.status(201).json({ data: req.body });
    const notification = await Notification.create({
        ...req.body,
        createdAt: new Date(),
        content: `${sender.name} ${action} ${receiver.name}`,
    });
    res.status(201).json({
        status: "success",
        data: notification,
    });
});
// TODO: CREATE MARK NOTIFICATION READ API CONTROLLER AND ROUTE
// exports.markNotificationRead = catchAsync(async (req, res, next) => {
//     const {};
// });
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//     const { query } = new ApiFeature(User.find(), { ...req.query })
//         .filter()
//         .sort()
//         .field()
//         .paginate();

//     const user = await query;
//     res.status(200).json({
//         status: "success",
//         length: user.length,
//         data: {
//             user,
//         },
//     });
// });

// exports.getUser = catchAsync(async (req, res, next) => {
// const user = await User.findById(req.params.id)
//         .populate("skills")
//         .populate("currentCourses")
//         .populate("savedPosts")
//         .populate("pastCoursesGrades.course");

//     if (!user)
//         return next(new AppError("No User was found with a given ID", 404));
//     res.status(200).json({ status: "success", data: { user } });
// });

// exports.updateUser = catchAsync(async (req, res, next) => {
//     const userId = req.body.id;
//     const data = { ...req.body };
//     [
//         "microsoftUniqueId",
//         "savedPosts",
//         "numberOfRecommended",
//         "studentNumber",
//         "email",
//     ].forEach((field) => delete data[field]);
//     const user = await User.findByIdAndUpdate(userId, data, {
//         new: true,
//         runValidators: true,
//     });
//     if (!user)
//         return next(new AppError("No User was found with a given ID", 404));
//     res.status(200).json({ status: "success", data: { user } });
// });
