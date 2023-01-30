const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const verifyJWT = require("../middleware/verifyJWT");

//! Home Feed Types
router.get("/", verifyJWT, postController.getPosts); //Done
//! Get Post By
router.get("/user/:id", postController.getPostByUserId);
router.get("/tag/:id", postController.getPostByTagId);
router.get("/search", postController.searchPost);

router.get("/getAllPosts", postController.getAllPosts); //Done
router.get("/find/:id", postController.getPost); //Done
router.post("/", verifyJWT, postController.createNewPost); //Done
router.put("/:id", verifyJWT, postController.updatePost); //Done
router.delete("/:id", verifyJWT, postController.deletePost); //!Fix
router.put("/view/:id", postController.addView); //Done
router.put("/like/:id", verifyJWT, postController.likePost); //Done
router.put("/unlike/:id", verifyJWT, postController.unLikePost); //Done

module.exports = router;
