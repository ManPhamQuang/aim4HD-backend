const User = require("../models/User");
const Notification = require("../models/Notification");
const catchAsync = require("../utils/catchAsync");
const ApiFeature = require("../utils/ApiFeature");
const AppError = require("../utils/appError");
const socketInstance = require("../socket-instance");

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
    const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
    };
    const notifications = await Notification.find(
        { receiver: req.params.id },
        null,
        {
            sort: { createdAt: -1 },
            skip: (options.page - 1) * options.limit,
            limit: options.limit,
        }
    );
    // .populate("sender")
    // .populate("receiver");
    // let conversation = await ChatMessage.find({ chatRoomId: roomId }, null, {
    //         sort: { createdAt: -1 },
    //         skip: (options.page -1) * options.limit,
    //         limit: options.limit,
    //     });

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
    await notification.populate("sender").populate("receiver").execPopulate();

    socketInstance.io.to(receiverId.toString()).emit("newNoti", notification);
    return notification;
};

exports.createNotis = async ({
    sender: senderId,
    receivers: receiverIds,
    action,
    postLink,
}) => {
    const sender = await User.findById(senderId);
    const promises = receiverIds.map(async (el) => {
        const receiver = await User.findById(el);
        let newNoti = {
            sender: senderId,
            receiver: el,
            createdAt: new Date(),
            postLink: postLink,
            action: action,
            createdAt: new Date(),
            content: `${sender.name} ${action} ${receiver.name}`,
        };
        return newNoti;
    });
    // global.io.sockets.in(roomId).emit("new message", { message: post }); // TODO: CHANGE THE GLOBAL IO VARIABLE
    // socketInstance.io.sockets.in(roomId).emit("new message", {message: })
    // socketInstance.io.emit("new message", {message: })

    return Notification.insertMany(await Promise.all(promises));
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

exports.markAllNotificationRead = catchAsync(async (req, res, next) => {
    const userId = req.body.userId;
    const notificationsRead = await Notification.updateMany(
        { receiver: userId },
        { $set: { read: true } }
    );
    if (!notificationsRead)
        return next(
            new AppError("No Notification was found with given user id", 404)
        );
    const notifications = await Notification.find({ receiver: userId }, null, {
        sort: { createdAt: -1 },
    });

    res.status(200).json({
        status: "success",
        data: { notifications },
    });
});
