const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllComment,
  createComment,
} = require("../controller/commentController");

router.get("/", getAllComment);
router.post("/", createComment);
module.exports = router;
