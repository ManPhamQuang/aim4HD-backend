const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createGroup,
  getUserGroup,
  updateGroup,
  deleteGroup,
} = require("../controller/groupController");

router.get("/:userId", getUserGroup);
router.post("/", createGroup);
router.patch("/:id", updateGroup);
router.delete("/:id", deleteGroup);

module.exports = router;
