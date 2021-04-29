const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const userRouter = require("./route/userRoute");
const skillRouter = require("./route/skillRoute");
const postRouter = require("./route/postRoute");
const courseRouter = require("./route/courseRoute");
const globalErrorAppHandler = require("./controller/errorController");
const Notification = require("./models/Notification");
const AppError = require("./utils/appError");
const app = express();
const chatroomRouter = require("./route/chatroomRoute");
const server = require("http").createServer(app);
const socketInstance = require("./socket-instance");
socketInstance.configure(server);

// server.listen(5000, () => {
//     console.log("express and socket running on 5000");
// });

socketInstance.io.on("connection", function (socketClient) {
    socketClient.on("room ids", (data) => {
        // join all room id provided in the data array
        console.log("receiving room ids", data);
        // data.forEach((room) => socket.join(room));
        socketClient.join(data);
    });
    console.log(`Client with ID of ${socketClient.id} connected!`);
    socketClient.on("getNotification", async ({ id }) => {
        socketClient.join(id);
        const notifications = await Notification.find(
            {
                receiver: id,
            },
            null,
            {
                sort: { createdAt: -1 },
            }
        )
            .populate("sender")
            .populate("receiver");

        socketInstance.io
            .to(id)
            .emit("notifications", { notifications: notifications });
    });
    socketClient.on("disconnect", () => {
        console.log("disconnected");
    });
    socketClient.on("error", function (err) {
        console.log(err);
    });
});

const notificationRouter = require("./route/notificationRoute");

// http.listen(4000, function () {
//     console.log("socket.io is listening on port 4000");
// });

app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());
app.use(xss());
app.use(hpp());
app.use(compression());

app.use("/api/v1/posts", postRouter);

app.use("/api/v1/users", userRouter);

app.use("/api/v1/skills", skillRouter);

app.use("/api/v1/courses", courseRouter);

app.use("/api/v1/notification", notificationRouter);

app.use("/api/v1/chatroom", chatroomRouter);

app.all("*", (req, res, next) => {
    return next(
        new AppError(
            `Given url ${req.method} ${req.originalUrl} does not exist`,
            404
        )
    );
});

app.use(globalErrorAppHandler);

module.exports = server;
