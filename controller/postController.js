const Post = require("../models/Post");
const Skill = require("../models/Skill");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find().populate("author");
  res.status(200).json({
    status: "success",
    data: {
      posts,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate("author")
    .populate("requiredSkills");
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});
