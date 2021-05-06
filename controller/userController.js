const User = require("../models/User");
const Skill = require("../models/Skill");
const Course = require("../models/Course");
const catchAsync = require("../utils/catchAsync");
const ApiFeature = require("../utils/ApiFeature");
const AppError = require("../utils/appError");
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const { query } = new ApiFeature(User.find(), { ...req.query })
        .filter()
        .sort()
        .field()
        .paginate();

    const user = await query;
    res.status(200).json({
        status: "success",
        length: user.length,
        data: {
            user,
        },
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
        .populate("skills")
        .populate("currentCourses")
        .populate("savedPosts")
        .populate("pastCoursesGrades.course");

    if (!user)
        return next(new AppError("No User was found with a given ID", 404));
    res.status(200).json({ status: "success", data: { user } });
});

exports.searchUser = catchAsync(async (req, res, next) => {
    console.log(req.body.query);
    const users = await User.fuzzySearch("Phuong");
    if (!users) {
        return next(new AppError("No users was found with given query", 404));
    }
    res.status(200).json({ status: "success", data: users });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const userId = req.body.id;
    const data = { ...req.body };
    [
        "microsoftUniqueId",
        "savedPosts",
        "numberOfRecommended",
        "studentNumber",
        "email",
    ].forEach((field) => delete data[field]);
    const user = await User.findByIdAndUpdate(userId, data, {
        new: true,
        runValidators: true,
    })
        .populate("skills")
        .populate("currentCourses")
        .populate("savedPosts")
        .populate("pastCoursesGrades.course");
    if (!user)
        return next(new AppError("No User was found with a given ID", 404));
    res.status(200).json({ status: "success", data: { user } });
});
