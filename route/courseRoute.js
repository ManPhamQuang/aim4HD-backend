const express = require("express");
const router = express.Router();
const { getAllCourse, getCourse } = require("../controller/courseController");
router.get("/", getAllCourse);
router.get("/:id", getCourse);

module.exports = router;
