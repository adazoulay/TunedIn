const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/find/:id", postController.getPost); //Done
router.post("/", verifyJWT, postController.createNewPost); //Done
router.put("/:id", verifyJWT, postController.updatePost); //Done
router.delete("/:id", verifyJWT, postController.deletePost); //!Fix
router.put("/view/:id", postController.addView); //Done
router.put("/like/:id", verifyJWT, postController.likePost); //Done
router.put("/unlike/:id", verifyJWT, postController.unLikePost); //Done
router.get("/:postId/comments", postController.getComments); //? Maybe don't need

//! Home Feed Types
router.get("/", postController.getAllPosts); //Done
router.get("/trend", postController.getRandom);
router.get("/random", postController.getTrend);
router.get("/sub", verifyJWT, postController.getSub);
router.get("/search", postController.searchPost);

//! Get Post By
router.get("/user/:id", postController.getPostByUserId);
router.get("/tag/:id", postController.getPostByTagId);

module.exports = router;
