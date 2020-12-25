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
  const groups = await Group.find({ members: { $in: req.params.userId } })
    .populate("members")
    .populate("course");
  return res.status(200).json({
    status: "success",
    data: { groups },
  });
});

exports.updateGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .populate("members")
    .populate("course");
  if (!group)
    return next(new AppError("No group was found with a given ID", 404));
  return res.status(200).json({
    status: "success",
    data: { group },
  });
});

exports.deleteGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndDelete(req.params.id);
  if (!group)
    return next(new AppError("No group was found with a given ID", 404));
  res.status(204).end();
});
