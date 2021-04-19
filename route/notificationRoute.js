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
const Notification = require("../models/Notification");
// const {
//     signup,
//     login,
//     checkIfLoginWithMicrosoft,
// } = require("../controller/authController");
// const { getPostsInfo } = require("../controller/postController");
// const feedbackRoute = require("./feedbackRoute");

// module.exports = function (io) {
//     const router = express.Router();
//     // const controller = require("../controller/notificationController")(io);
//     io.on("connection", (socket) => {
//         console.log(`Client with ID of ${socket.id} connected!`);
//         socket.on("getNotification", async (data) => {
//             console.log("getNotification event");
//             console.log(data);
//             const notifications = await Notification.find({
//                 receiver: data.id,
//             });
//             console.log(notifications);
//             // let notifications = ["h1"];
//             socket.emit("notifications", { notifications: notifications });
//         });
//         // socket.emit("message", { data: "big data" });
//         socket.on("disconnect", () => {
//             console.log("disconnected");
//         });
//         socket.on("error", function (err) {
//             console.log(err);
//         });
//     });
//     router.get("/testSocket/:id", async (req, res, next) => {
//         const notifications = await Notification.find({
//             receiver: req.params.id,
//         });
//         // .populate("sender")
//         // .populate("receiver");

//         if (!notifications)
//             return next(
//                 new AppError("No notification was found with a given ID", 404)
//             );
//         res.status(200).json({ status: "sucess", data: { notifications } });
//     });

//     router.get("/:id", getNotificationOfUser);
//     router.post("/", createNotification);
//     router.patch("/", markNotificationRead);
//     return router;
// };

const router = express.Router();
router.get("/testSocket/:id", async (req, res, next) => {
    const notifications = await Notification.find({
        receiver: req.params.id,
    });
    // .populate("sender")
    // .populate("receiver");

    if (!notifications)
        return next(
            new AppError("No notification was found with a given ID", 404)
        );
    res.status(200).json({ status: "sucess", data: { notifications } });
});

router.get("/:id", getNotificationOfUser);
router.post("/", createNotification);
router.patch("/", markNotificationRead);
module.exports = router;

// router.use("/:userId/feedbacks", feedbackRoute);

// router.get("/", getAllUsers);

// router.get("/:id", getUser);

// router.post("/login", login);
// router.post("/signup", signup);
// router.post("/check", checkIfLoginWithMicrosoft);
// router.patch("/update", updateUser);
// router.get("/:userId/posts", getPostsInfo);

// module.exports = router;
