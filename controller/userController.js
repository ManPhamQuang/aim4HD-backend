const User = require("../models/User");
const Skill = require("../models/Skill");
const Course = require("../models/Course");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate("skills")
    .populate("currentCourse");
  res.status(200).json({ status: "success", data: { user } });
});
