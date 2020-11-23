const catchAsync = require("../utils/catchAsync");

exports.getAllCommentOfPost = catchAsync(async (req, res, next) => {
  console.log(req.params);
  res.status(200).json({
    status: "success",
  });
});
