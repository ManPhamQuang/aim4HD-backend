const express = require("express");
const router = express.Router({ mergeParams: true });
const { createGroup, getUserGroup } = require("../controller/groupController");

router.get("/:userId", getUserGroup);
router.post("/", createGroup);

module.exports = router;
