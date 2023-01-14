const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/", commentController.getAllComments); //Done
router.post("/:id", verifyJWT, commentController.createNewComment); //Done
router.put("/:id", verifyJWT, commentController.updateComment); //Done
router.delete("/:id", verifyJWT, commentController.deleteComment); //Done
router.get("/find/:id", commentController.getComment); //Done
router.get("/post/:id", commentController.getCommentsByPostId); //Done

module.exports = router;
