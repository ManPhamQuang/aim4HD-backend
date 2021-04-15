const express = require("express");
const router = express.Router({ mergeParams: true });
const {
    getAllComment,
    createComment,
    updateComment,
    deleteComment,
} = require("../controller/commentController");

router.get("/", getAllComment);
router.post("/", createComment);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);
module.exports = router;
