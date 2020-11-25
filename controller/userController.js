const User = require("../models/User");
const Skill = require("../models/Skill");
const Course = require("../models/Course");
const catchAsync = require("../utils/catchAsync");
const ApiFeature = require("../utils/ApiFeature");
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
    .populate("currentCourse");
  if (!user) return next(new AppError("No User found with a given ID", 404));
  res.status(200).json({ status: "success", data: { user } });
});
