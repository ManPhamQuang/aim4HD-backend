const catchAsync = require("../utils/catchAsync");
const Comment = require("../models/Comment");
const ApiFeature = require("../utils/ApiFeature");

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
