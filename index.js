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
const notificationRouter = require("./route/notificationRoute");
const globalErrorAppHandler = require("./controller/errorController");
const AppError = require("./utils/appError");
const app = express();
const http = require("http").createServer(app);
// const io = require("socket.io")(http);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

http.listen(4000, function () {
    console.log("socket.io is listening on port 4000");
});

io.on("connection", (socket) => {
    console.log(`Client with ID of ${socket.id} connected!`);
    socket.emit("message", { data: "big data" });
    socket.on("disconnect", () => {
        console.log("disconnected");
    });
    socket.on("error", function (err) {
        console.log(err);
    });
});

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

app.all("*", (req, res, next) => {
    return next(
        new AppError(
            `Given url ${req.method} ${req.originalUrl} does not exist`,
            404
        )
    );
});

app.use(globalErrorAppHandler);

module.exports = app;
