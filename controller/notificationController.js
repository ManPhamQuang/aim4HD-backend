const User = require("../models/User");
const Skill = require("../models/Skill");
const Course = require("../models/Course");
const Notification = require("../models/Notification");
const catchAsync = require("../utils/catchAsync");
const ApiFeature = require("../utils/ApiFeature");
const AppError = require("../utils/appError");
const socketInstance = require("../socket-instance");
const io = socketInstance.io;

const actionvalues = [
    "applied to your post",
    "applied to a post you're in",
    "approved your application",
    "uploaded a new post",
    "commented on your post",
    "commented on a post you're applied to",
    "commented on a post you're following",
];

exports.getNotificationOfUser = catchAsync(async (req, res, next) => {
    const notifications = await Notification.find({ receiver: req.params.id });
    // .populate("sender")
    // .populate("receiver");

    if (!notifications)
        return next(
            new AppError("No notification was found with a given ID", 404)
        );
    res.status(200).json({ status: "sucess", data: { notifications } });
});

exports.createNoti = async ({
    sender: senderId,
    receiver: receiverId,
    action,
    postLink,
}) => {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    const notification = await Notification.create({
        sender: senderId,
        receiver: receiverId,
        action: action,
        createdAt: new Date(),
        postLink: postLink,
        createdAt: new Date(),
        content: `${sender.name} ${action} ${receiver.name}`,
    });
    //  io.on("connection", function (socket) {
    //         console.log(`Client with ID of ${socket.id} connected!`);
    //         socket.on("getNotification", async (data) => {
    //             console.log("getNotification event");
    //             console.log(data);
    //             const notifications = await Notification.find({
    //                 receiver: data.id,
    //             });
    //             console.log(notifications);
    //             // let notifications = ["h1"];
    //             socket.emit("notifications", { notifications: notifications });
    //         });
    //         // socket.emit("message", { data: "big data" });
    //         socket.on("disconnect", () => {
    //             console.log("disconnected");
    //         });
    //         socket.on("error", function (err) {
    //             console.log(err);
    //         });
    //   });
    socketInstance.io.emit("newNoti", notification);
    // io.on("connection", function (socket) {
    //     console.log(`Client with ID of ${socket.id} connected!`);
    //     socket.on("getNotification", async (data) => {
    //         console.log("getNotification event");
    //         console.log(data);
    //         const notifications = await Notification.find({
    //             receiver: data.id,
    //         });
    //         console.log(notifications);
    //         // let notifications = ["h1"];
    //         socket.emit("notifications", { notifications: notifications });
    //     });
    //     // socket.emit("message", { data: "big data" });
    //     socket.on("disconnect", () => {
    //         console.log("disconnected");
    //     });
    //     socket.on("error", function (err) {
    //         console.log(err);
    //     });
    // });
    return notification;
};

exports.createNotification = catchAsync(async (req, res, next) => {
    const sender = await User.findById(req.body.sender);
    const receiver = await User.findById(req.body.receiver);
    const action = req.body.action;
    // res.status(201).json({ data: req.body });
    const notification = await Notification.create({
        ...req.body,
        createdAt: new Date(),
        content: `${sender.name} ${action} ${receiver.name}`,
    });
    res.status(201).json({
        status: "success",
        data: notification,
    });
});
// TODO: CREATE MARK NOTIFICATION READ API CONTROLLER AND ROUTE
exports.markNotificationRead = catchAsync(async (req, res, next) => {
    const notificationId = req.body.id;
    const data = { ...req.body };
    const notification = await Notification.findByIdAndUpdate(
        notificationId,
        data,
        {
            new: true,
            runValidators: true,
        }
    );
    if (!notification)
        return next(
            new AppError("No Notification was found with a given ID", 404)
        );
    res.status(200).json({ status: "success", data: { notification } });
});
