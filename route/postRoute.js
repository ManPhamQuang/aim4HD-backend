const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  applyForPost,
} = require("../controller/postController");
const { checkLogin } = require("../controller/authController");
const commentRoute = require("./commentRoute");

router.use("/:postId/comments", commentRoute);

router.get("/", getAllPosts);
router.get("/:id", getPost);

// router.use(checkLogin);

router.post("/", createPost);
router.post("/:id", applyForPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
