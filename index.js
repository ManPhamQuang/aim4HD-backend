const express = require("express");
const cors = require("cors");
const userRouter = require("./route/userRoute");
const skillRouter = require("./route/skillRoute");
const postRouter = require("./route/postRoute");
const courseRouter = require("./route/courseRoute");
const globalErrorAppHandler = require("./controller/errorController");
const AppError = require("./utils/appError");
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1/posts", postRouter);

app.use("/api/v1/users", userRouter);

app.use("/api/v1/skills", skillRouter);

app.use("/api/v1/courses", courseRouter);

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
