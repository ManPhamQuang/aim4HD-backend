const catchAsync = require("../utils/catchAsync");
const Comment = require("../models/Comment");
const ApiFeature = require("../utils/ApiFeature");
const AppError = require("../utils/appError");

exports.getAllComment = catchAsync(async (req, res, next) => {
  const currentQuery = Comment.find({ post: req.params.id })
    .populate("user")
    .select("-post");
  const { query } = new ApiFeature(currentQuery, { ...req.query })
    .filter()
    .sort()
    .field()
    .paginate();
  const comments = await query;
  res.status(200).json({
    status: "success",
    length: comments.length,
    data: {
      comments,
    },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      content: req.body.content,
    },
    { new: true }
  );
  if (!comment)
    return next(new AppError("No Comment found with a given ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment)
    return next(new AppError("No Comment found with a given ID", 404));
  res.status(204).end();
});
