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

exports.updateExistingDocWithNgrams = catchAsync(async (req, res, next) => {
    const cursor = User.find().cursor();
    attrs = ["name"];
    cursor.next(async (error, doc) => {
        if (error) {
            // TODO: specific error message return
            console.log(error);
            return next(new AppError("some error happend"));
        }
        const obj = attrs.reduce(
            (acc, attr) => ({ ...acc, [attr]: doc[attr] }),
            {}
        );
        console.log(obj);
        let result = await User.findByIdAndUpdate(doc._id, obj);
        res.status(200).json({ status: "success", data: result });
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
    let queryString = req.query.query;
    const currentQuery = User.fuzzySearch({
        query: queryString,
        // prefixOnly: true, // TODO: check back with this
        minSize: 1,
    })
        .populate("skills")
        .populate("currentCourses");
    const { query } = new ApiFeature(currentQuery, { ...req.query })
        .filter()
        .sort()
        .field();
    const data = await query;
    if (!data) {
        return next(new AppError("No users was found with given query", 404));
    }
    res.status(200).json({ status: "success", data: data });
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
