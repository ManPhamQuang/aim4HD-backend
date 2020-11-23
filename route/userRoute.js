const express = require("express");
const { getUser, getAllUsers } = require("../controller/userController");
const { signup } = require("../controller/authController");
const router = express.Router();

router.get("/", getAllUsers);

router.get("/:id", getUser);

router.post("/signup", signup);

module.exports = router;
