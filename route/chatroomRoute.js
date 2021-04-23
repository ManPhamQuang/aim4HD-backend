const express = require("express");
const router = express.Router({ mergeParams: true });

const {
    initiateChat,
    postMessage,
    getConversationByRoomId,
    markConversationReadByRoomId,
} = require("../controller/chatroomController");

router.get("/:roomId/message", getConversationByRoomId);
router.post("/initiate", initiateChat);
router.post("/:roomId/message", postMessage);
router.put("/:roomId/mark-read", markConversationReadByRoomId);

module.exports = router;
