const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const verifyJWT = require("../middleware/verifyJWT");

//! Home Feed Types
router.get("/", verifyJWT, postController.getPosts);

//! Get Post By
router.get("/find/:id", postController.getPost); //Done
router.get("/user/:id", postController.getPostByUserId);
router.get("/tag/:id", postController.getPostByTagId);
router.get("/search", postController.searchPost);

//! Mutate
router.post("/", verifyJWT, postController.createNewPost);
router.put("/:id", verifyJWT, postController.updatePost);
router.delete("/:id", verifyJWT, postController.deletePost); //!Fix

//! Interact
router.put("/view/:id", postController.addView);
router.put("/like/:id", verifyJWT, postController.likePost);
router.put("/unlike/:id", verifyJWT, postController.unLikePost);
router.put("/save/:id", verifyJWT, postController.savePost);
router.put("/unsave/:id", verifyJWT, postController.unSavePost);

router.get("/getAllPosts", postController.getAllPosts);

module.exports = router;
