const express = require("express");
const { getUser, getAllUsers } = require("../controller/userController");
const {
  signup,
  login,
  checkIfLoginWithMicrosoft,
} = require("../controller/authController");
const router = express.Router();

router.get("/", getAllUsers);

router.get("/:id", getUser);

router.post("/login", login);
router.post("/signup", signup);
router.post("/check", checkIfLoginWithMicrosoft);

module.exports = router;
