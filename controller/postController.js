const Post = require("../models/Post");
const Skill = require("../models/Skill");
const User = require("../models/User");
const Comment = require("../models/Comment");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeature = require("../utils/ApiFeature");

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const currentQuery = Post.find()
    .populate("course")
    .populate("requiredSkills")
    .populate("author");
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
  const query = Post.findById(req.params.id)
    .populate("requiredSkills")
    .populate("course")
    .populate("author");
  if (req.query.author)
    query
      .select("+approvedMembers")
      .populate("approvedMembers")
      .select("+appliedStudents")
      .populate("appliedStudents");
  const post = await query;
  if (!post)
    return next(new AppError("No Post was found with a given ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({ ...req.body, createdAt: Date.now() });
  res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  let post;
  const { approvedMembers, isOpen } = req.body;
  if (approvedMembers) {
    console.log("ENTER 1st BLOCK");
    post = await Post.findById(req.params.id)
      .select("+approvedMembers")
      .select("+appliedStudents");
    post.approvedMembers.push(req.body.approvedMembers);
    post.appliedStudents = post.appliedStudents.filter(
      studentId => studentId.toString() !== approvedMembers
    );
    await post.save();
  } else if (isOpen === false) {
    console.log("ENTER 2nd BLOCK");
    post = await Post.findById(req.params.id).select("+closedAt");
    post.isOpen = false;
    post.closedAt = Date.now();
    await post.save();
  } else {
    console.log("ENTER 3rd block");
    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
  }
  if (!post)
    return next(new AppError("No Post was found with a given ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { isOpen: false });
  if (!post)
    return next(new AppError("No Post was found with a given ID", 404));
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
  if (!post)
    return next(new AppError("No Post was found with a given ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});
