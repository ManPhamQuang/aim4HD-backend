const express = require("express");
// const {
//     getUser,
//     getAllUsers,
//     updateUser,
// } = require("../controller/userController");
const {
    getNotificationOfUser,
    createNotification,
    markNotificationRead,
} = require("../controller/notificationController");
// const {
//     signup,
//     login,
//     checkIfLoginWithMicrosoft,
// } = require("../controller/authController");
// const { getPostsInfo } = require("../controller/postController");
// const feedbackRoute = require("./feedbackRoute");
const router = express.Router();

router.get("/:id", getNotificationOfUser);
router.post("/", createNotification);
router.patch("/", markNotificationRead);
// router.use("/:userId/feedbacks", feedbackRoute);

// router.get("/", getAllUsers);

// router.get("/:id", getUser);

// router.post("/login", login);
// router.post("/signup", signup);
// router.post("/check", checkIfLoginWithMicrosoft);
// router.patch("/update", updateUser);
// router.get("/:userId/posts", getPostsInfo);

module.exports = router;
