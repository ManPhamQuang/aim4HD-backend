const express = require("express");
const userRouter = require("./route/userRoute");
const skillRouter = require("./route/skillRoute");
const app = express();

app.use(express.json());

app.use("/api/v1/users", userRouter);

app.use("/api/v1/skills", skillRouter);

module.exports = app;
