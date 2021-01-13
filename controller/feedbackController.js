const Feedback = require("../models/Feedback");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");
const AppError = require("../utils/appError");
exports.getAllFeedbackOfUser = catchAsync(async (req, res, next) => {
  const feedbacks = await Feedback.find({ user: req.params.userId })
    .populate("author")
    .populate("user");
  return res.status(200).json({
    status: "success",
    length: feedbacks.length,
    data: { feedbacks },
  });
});

exports.createFeedback = catchAsync(async (req, res, next) => {
  const checkIfAlreadyGaveFeedback = await Feedback.find({
    user: req.params.userId,
    author: req.body.author,
  });
  if (checkIfAlreadyGaveFeedback.length === 0) {
    const targetUser = await User.findById(req.params.userId);
    const feedback = await Feedback.create({
      ...req.body,
      user: req.params.userId,
    });
    targetUser.numberOfRecommended = req.body.isRecommended
      ? targetUser.numberOfRecommended + 1
      : targetUser.numberOfRecommended - 1;
    await targetUser.save({ validateModifiedOnly: true });
    return res.status(201).json({
      status: "success",
      data: { feedback },
    });
  }
  return next(new AppError("You already give feedback to this user", 400));
});

exports.updateFeedback = catchAsync(async (req, res, next) => {
  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    { ...req.body, user: req.params.userId },
    {
      new: true,
    }
  )
    .populate("author")
    .populate("user");
  if (!feedback)
    return next(new AppError("No feedback was found with a given ID", 404));
  return res.status(200).json({
    status: "success",
    data: { feedback },
  });
});

exports.deleteFeedback = catchAsync(async (req, res, next) => {
  const feedback = await Feedback.findByIdAndDelete(req.params.id);
  if (!feedback)
    return next(new AppError("No feedback was found with a given ID", 404));
  return res.status(204).end();
});
