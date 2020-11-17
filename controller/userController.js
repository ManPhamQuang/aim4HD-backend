const User = require("../models/User");
const Skill = require("../models/Skill");
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
  const user = await User.findById(req.params.id).populate("skills");
  res.status(200).json({ status: "success", data: { user } });
});

exports.createUser = catchAsync(async (req, res) => {
  const user = await User.create(req.body);
  return res.status(201).json({ status: "success", data: { user } });
});
