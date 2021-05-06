const express = require("express");
const {
    getUser,
    getAllUsers,
    updateUser,
    searchUser,
} = require("../controller/userController");
const {
    signup,
    login,
    checkIfLoginWithMicrosoft,
} = require("../controller/authController");
const { getPostsInfo } = require("../controller/postController");
const feedbackRoute = require("./feedbackRoute");
const router = express.Router();

router.use("/:userId/feedbacks", feedbackRoute);

router.get("/", getAllUsers);

router.get("/:id", getUser);
router.get("/search/fuzzy", searchUser);

router.post("/login", login);
router.post("/signup", signup);
router.post("/check", checkIfLoginWithMicrosoft);
router.patch("/update", updateUser);
router.get("/:userId/posts", getPostsInfo);

module.exports = router;
