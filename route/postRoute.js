const express = require("express");
const router = express.Router();
const { getAllPosts, getPost } = require("../controller/postController");

router.get("/", getAllPosts);
router.get("/:id", getPost);

module.exports = router;
