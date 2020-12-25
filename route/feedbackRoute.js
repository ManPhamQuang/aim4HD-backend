const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllFeedbackOfUser,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controller/feedbackController");

router.get("/", getAllFeedbackOfUser);
router.post("/", createFeedback);
router.patch("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);

module.exports = router;
