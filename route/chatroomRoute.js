const express = require("express");
const router = express.Router({ mergeParams: true });

const {
    initiateChat,
    postMessage,
    getConversationByRoomId,
} = require("../controller/chatroomController");

router.get("/:roomId/message", getConversationByRoomId);
router.post("/initiate", initiateChat);
router.post("/:roomId/message", postMessage);

module.exports = router;
