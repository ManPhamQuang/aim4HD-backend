const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const { createNoti, createNotis } = require("./notificationController");
const makeValidation = require("@withvoid/make-validation");
const ChatMessage = require("../models/ChatMessage");
const ChatRoom = require("../models/ChatRoom");

exports.initiateChat = catchAsync(async (req, res, next) => {
    // to start a new chat room between an array of user ids
    const { userIds, type, chatInitiator } = req.body;
    if (!userIds || !type || !chatInitiator) {
        res.status(400).json({
            status: "failed",
            message: "Please provide userids, type, chatInitiator",
        });
    } else {
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
    }
});

exports.postMessage = catchAsync(async (req, res, next) => {
    const { roomId } = req.params;
    const room = await ChatRoom.findById(roomId);
    if (!room) {
        return res.status(400).json({
            success: false,
            message: "No room exists for this id",
        });
    }
    const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
            messageText: { type: types.string },
        },
    }));
    if (!validation.success) return res.status(400).json({ ...validation });

    const messagePayload = {
        messageText: req.body.messageText,
    };
    const currentLoggedUser = req.body.postedByUser;
    const post = await ChatMessage.createPostInChatRoom(
        roomId,
        messagePayload,
        currentLoggedUser
    );

    let notification = await createNotis({
        sender: currentLoggedUser,
        receivers: room.userIds.filter((id) => {
            return !id.equals(currentLoggedUser);
        }),
        action: "sent a message",
        postLink: roomId,
    });
    // global.io.sockets.in(roomId).emit("new message", { message: post }); // TODO: CHANGE THE GLOBAL IO VARIABLE
    return res.status(200).json({ success: true, post, notification });
});

exports.getConversationByRoomId = catchAsync(async (req, res, next) => {
    const { roomId } = req.params;
    const room = await ChatRoom.findById(roomId);
    if (!room) {
        return res.status(400).json({
            success: false,
            message: "No room exists for this id",
        });
    }
    // const users = await User.getUserByIds(room.userIds);
    const users = await User.find({ _id: { $in: room.userIds } });
    const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
    };
    // const conversation = await ChatMessage.getConversationByRoomId(
    //     roomId,
    //     options
    // );
    const conversation = await getConversationByRoomId(roomId, options);
    return res.status(200).json({
        success: true,
        conversation,
        users,
    });
});

const getConversationByRoomId = async (roomId, options) => {
    let conversation = await ChatMessage.find({ chatRoomId: roomId }, null, {
        sort: { createdAt: -1 },
        skip: options.page * options.limit,
        limit: options.limit,
    });
    return conversation;
};

exports.markConversationReadByRoomId = catchAsync(async (req, res, next) => {
    const { roomId } = req.params;
    const room = await ChatRoom.findById(roomId);
    if (!room) {
        return res.status(400).json({
            success: false,
            message: "No room exists for this id",
        });
    }

    const currentLoggedUser = req.body.userId;
    const result = await markMessageRead(roomId, currentLoggedUser);
    return res.status(200).json({ success: true, data: result });
});

const markMessageRead = async (chatRoomId, currentLoggedUser) => {
    return ChatMessage.updateMany(
        {
            chatRoomId: chatRoomId,
            "readByRecipients.readByUserId": { $ne: currentLoggedUser },
        },
        {
            $addToSet: {
                readByRecipients: { readByUserId: currentLoggedUser },
            },
        },
        { multi: true }
    );
};
