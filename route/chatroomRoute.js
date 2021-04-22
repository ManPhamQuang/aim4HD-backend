const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    getAllComment,
    createComment,
    updateComment,
    deleteComment,
} = require("../controller/commentController");

const { initiateChat } = require("../controller/chatroomController");

// router.get("/", getAllComment);
router.post("/", initiateChat);
// router.patch("/:id", updateComment);
// router.delete("/:id", deleteComment);
module.exports = router;
