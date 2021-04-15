const Course = require("../models/Course");
const School = require("../models/School");
const catchAsync = require("../utils/catchAsync");
const ApiFeature = require("../utils/ApiFeature");

exports.getAllCourse = catchAsync(async (req, res, next) => {
    const { query } = new ApiFeature(Course.find(), { ...req.query })
        .filter()
        .sort()
        .field()
        .paginate();
    const courses = await query;
    res.status(200).json({
        status: "success",
        length: courses.length,
        data: {
            courses,
        },
    });
});

exports.getCourse = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate("school");
    res.status(200).json({
        status: "success",
        data: {
            course,
        },
    });
});
