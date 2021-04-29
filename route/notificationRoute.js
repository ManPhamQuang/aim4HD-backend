const express = require("express");

const {
    getNotificationOfUser,
    createNotification,
    markNotificationRead,
    markAllNotificationRead,
} = require("../controller/notificationController");
const Notification = require("../models/Notification");

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
router.patch("/readAll", markAllNotificationRead);
module.exports = router;
