const express = require("express");
const router = express.Router({ mergeParams: true });
const { getAllCommentOfPost } = require("../controller/commentController");

router.get("/", getAllCommentOfPost);
router.post("/", createCommentFor);
module.exports = router;
