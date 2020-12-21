const Post = require("../models/Post");
const Skill = require("../models/Skill");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeature = require("../utils/ApiFeature");

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const currentQuery = Post.find()
    .populate({
      path: "author",
      populate: { path: "skills" },
    })
    .populate({ path: "course" })
    .populate({ path: "requiredSkills" });

  const { query } = new ApiFeature(currentQuery, { ...req.query })
    .filter()
    .sort()
    .field()
    .paginate();

  const data = await query;
  res.status(200).json({
    status: "success",
    length: data.length,
    data: {
      posts: data,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate({
      path: "author",
      populate: { path: "skills" },
    })
    .populate("requiredSkills")
    .populate("appliedStudents")
    .populate("course");
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

exports.applyForPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  const currentUserId = req.body.userId;
  if (post.appliedStudents.includes(currentUserId)) {
    post.appliedStudents = post.appliedStudents.filter(
      userId => userId.toString() !== currentUserId
    );
  } else post.appliedStudents.push(currentUserId);
  await post.save();
  if (!post) return next(new AppError("No Post found with a given ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});
