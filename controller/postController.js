const Post = require("../models/Post");
const Skill = require("../models/Skill");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const query = Post.find().populate({
    path: "author",
    populate: { path: "skills" },
  });

  // Filter
  const queryObj = { ...req.query };
  const excludeFields = ["sort", "page", "limit", "fields"];
  excludeFields.forEach(field => delete queryObj[field]);
  query.find(queryObj);

  // Sort
  if (req.query.sort) {
    const sortCriteria = req.query.sort.replace(",", " ");
    query.sort(sortCriteria);
  } else {
    query.sort("createdAt");
  }

  // Fields

  if (req.query.fields) {
    const chosenFields = req.query.fields.replace(",", " ");
    query.select(chosenFields);
  } else {
    query.select("-__v");
  }

  // pagination

  const currentPage = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) || 3;
  const skip = (currentPage - 1) * pageSize;
  query.skip(skip).limit(pageSize);

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
