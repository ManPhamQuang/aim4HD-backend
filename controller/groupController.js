const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Group = require("../models/Group");

exports.createGroup = catchAsync(async (req, res, next) => {
  const group = await Group.create({
    members: req.body.members,
    course: req.body.course,
  });
  return res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

exports.getUserGroup = catchAsync(async (req, res, next) => {
  const groups = await Group.find({ members: { $in: req.body.userId } })
    .populate("members")
    .populate("course");
  return res.status(200).json({
    status: "success",
    data: { groups },
  });
});
