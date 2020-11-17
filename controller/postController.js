const Post = require("../models/Post");
const Skill = require("../models/Skill");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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
  if (!post) return next(new AppError("No Post found with a given ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!post) return next(new AppError("No Post found with a given ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { isOpen: false });
  if (!post) return next(new AppError("No Post found with a given ID", 404));
  res.status(204).end();
});
