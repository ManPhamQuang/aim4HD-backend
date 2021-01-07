const express = require("express");
const {
  getUser,
  getAllUsers,
  updateUser,
} = require("../controller/userController");
const {
  signup,
  login,
  checkIfLoginWithMicrosoft,
} = require("../controller/authController");
const { getPostsAdmitted } = require("../controller/postController");
const feedbackRoute = require("./feedbackRoute");
const router = express.Router();

router.use("/:userId/feedbacks", feedbackRoute);

router.get("/", getAllUsers);

router.get("/:id", getUser);

router.post("/login", login);
router.post("/signup", signup);
router.post("/check", checkIfLoginWithMicrosoft);
router.patch("/update", updateUser);
router.get("/:userId/posts", getPostsAdmitted);

module.exports = router;
