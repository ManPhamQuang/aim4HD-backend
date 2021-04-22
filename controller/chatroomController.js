const Post = require("../models/Post");
const Skill = require("../models/Skill");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeature = require("../utils/ApiFeature");
const sendEmail = require("../utils/sendEmail");
const { createNoti } = require("./notificationController");
const ChatRoom = require("../models/ChatRoom");

exports.initiateChat = catchAsync(async (req, res, next) => {
    // to start a new chat room between an array of user ids
    const { userIds, type, chatInitiator } = req.body;
    try {
        const availableRoom = await ChatRoom.findOne({
            userIds: {
                $size: userIds.length,
                $all: [...userIds],
            },
            type,
        });

        if (availableRoom) {
            res.status(200).json({
                status: "success",
                data: {
                    isNew: false,
                    message: "retrieving an old chat room",
                    chatRoomId: availableRoom._id,
                    type: availableRoom.type,
                },
            });
        }

        if (!availableRoom) {
            const newRoom = await ChatRoom.create({
                userIds,
                type,
                chatInitiator,
            });
            res.status(200).json({
                status: "success",
                data: {
                    isNew: true,
                    message: "creating a new chatroom",
                    chatRoomId: newRoom._id,
                    type: newRoom.type,
                },
            });
        }
    } catch (error) {
        console.log("error on start chat method", error);
        throw error;
    }
});

// exports.getAllPosts = catchAsync(async (req, res, next) => {
//     const currentQuery = Post.find()
//         .populate("course")
//         .populate("requiredSkills")
//         .populate("author")
//         .select("+appliedStudents")
//         .populate("appliedStudents");
//     const { query } = new ApiFeature(currentQuery, { ...req.query })
//         .filter()
//         .sort()
//         .field()
//         .paginate();

//     const data = await query;
// res.status(200).json({
//     status: "success",
//     length: data.length,
//     data: {
//         posts: data,
//     },
// });
// });

// exports.getPost = catchAsync(async (req, res, next) => {
//     const query = Post.findById(req.params.id)
//         .populate("requiredSkills")
//         .populate("course")
//         .populate("author")
//         .populate("approvedMembers");
//     // if (req.query.author)
//     query.select("+appliedStudents").populate("appliedStudents");
//     const post = await query;
//     if (!post)
//         return next(new AppError("No Post was found with a given ID", 404));
//     res.status(200).json({
//         status: "success",
//         data: {
//             post,
//         },
//     });
// });

// exports.createPost = catchAsync(async (req, res, next) => {
//     const post = await Post.create({ ...req.body, createdAt: new Date() });
//     res.status(201).json({
//         status: "success",
//         data: {
//             post,
//         },
//     });
// });

// exports.updatePost = catchAsync(async (req, res, next) => {
//     let post;
//     const { approvedMembers, isOpen, removedMembers } = req.body;
//     if (approvedMembers) {
//         console.log("ENTER 1st BLOCK");
//         post = await Post.findById(req.params.id)
//             .select("+appliedStudents")
//             .populate("author");
//         post.approvedMembers.push(req.body.approvedMembers);
//         post.appliedStudents = post.appliedStudents.filter(
//             (studentId) => studentId.toString() !== approvedMembers
//         );
//         post.currentMember =
//             post.currentMember === post.maximumMember
//                 ? post.maximumMember
//                 : post.currentMember + 1;
//         await post.save();
//         const user = await User.findById(approvedMembers);
//         const response = await sendEmail({
//             email: user.email,
//             subject: "Notify of getting accepted into group",
//             message: `Dear ${user.name},
//     We are happy to announce that you have been approved to join the team on the post about ${post.title} by ${post.author.name}. We hoped you have a nice time with your teammate.
//     Sincirely, Team aim4hd`,
//         });
//     } else if (isOpen === false) {
//         console.log("ENTER 2nd BLOCK");
//         post = await Post.findById(req.params.id).select("+closedAt");
//         post.isOpen = false;
//         post.closedAt = Date.now();
//         await post.save();
//     } else if (removedMembers) {
//         post = await Post.findById(req.params.id).populate("course");
//         post.approvedMembers = post.approvedMembers.filter(
//             (studentId) => studentId.toString() !== removedMembers
//         );
//         post.currentMember =
//             post.currentMember === 0 ? 0 : post.currentMember - 1;
//         await post.save();
//         const user = await User.findById(removedMembers);
//         const response = await sendEmail({
//             email: user.email,
//             subject: "Notify of getting removed from your group",
//             message: `Dear ${user.name},
//       We are very sad to announce that that you have been kicked out of the group for ${post.course.name}. Please do not be sad, you can try our application again to look for an alternate group.
//       Sincerely, Team aim4hd`,
//         });
//     } else {
//         console.log("ENTER 3rd block");
//         post = await Post.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//         });
//     }
//     if (!post)
//         return next(new AppError("No Post was found with a given ID", 404));
//     res.status(200).json({
//         status: "success",
//         data: {
//             post,
//         },
//     });
// });

// exports.deletePost = catchAsync(async (req, res, next) => {
//     const post = await Post.findByIdAndDelete(req.params.id);
//     if (!post)
//         return next(new AppError("No Post was found with a given ID", 404));
//     res.status(204).end();
// });

// exports.applyForPost = catchAsync(async (req, res, next) => {
//     if (req.query.savedPosts) {
//         const currentUserId = req.body.userId;
//         const currentPostId = req.params.id;
//         const user = await User.findById(currentUserId);
//         if (user.savedPosts.includes(currentPostId)) {
//             user.savedPosts = user.savedPosts.filter(
//                 (postId) => postId.toString() !== currentPostId
//             );
//         } else user.savedPosts.push(currentPostId);
//         await user.save({ validateModifiedOnly: true });
//         return res.status(200).json({
//             status: "success",
//             data: {
//                 user,
//             },
//         });
//     }
//     const post = await Post.findById(req.params.id).select("+appliedStudents");
//     if (!post)
//         return next(new AppError("No Post was found with a given ID", 404));
//     const currentUserId = req.body.userId;
//     const currentPostId = req.params.id;
//     if (post.appliedStudents.includes(currentUserId)) {
//         post.appliedStudents = post.appliedStudents.filter(
//             (userId) => userId.toString() !== currentUserId
//         );
//     } else post.appliedStudents.push(currentUserId);
//     await post.save();
//     let notification = await createNoti({
//         sender: currentUserId,
//         receiver: post.author,
//         action: "applied to your post",
//         postLink: currentPostId,
//     });
//     res.status(200).json({
//         status: "success",
//         data: {
//             post,
//         },
//         notification: notification,
//     });
// });

// exports.getPostsInfo = catchAsync(async (req, res, next) => {
//     if (req.query.savedPosts) {
//         const user = await User.findById(req.params.userId).populate({
//             path: "savedPosts",
//             select: "+appliedStudents",
//             populate: "course requiredSkills author appliedStudents",
//         });
//         const posts = user.savedPosts;
//         return res.status(200).json({
//             status: "success",
//             length: posts.length,
//             data: {
//                 posts: posts,
//             },
//         });
//     }

//     const posts = await Post.find({
//         approvedMembers: { $in: req.params.userId },
//     })
//         .populate("course")
//         .populate("approvedMembers")
//         .select("+closedAt");
//     res.status(200).json({
//         status: "success",
//         length: posts.length,
//         data: {
//             posts,
//         },
//     });
// });
