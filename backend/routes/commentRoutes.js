const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/", commentController.getAllComments); //Done
router.post("/:id", verifyJWT, commentController.createNewComment); //Done
router.put("/:id", verifyJWT, commentController.updateComment);
router.delete("/:id", verifyJWT, commentController.deleteComment);
router.get("/find/:id", commentController.getComment); //Done

module.exports = router;
