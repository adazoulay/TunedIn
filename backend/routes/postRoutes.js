const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/", postController.getAllPosts); //Done
router.post("/", verifyJWT, postController.createNewPost); //Done
router.put("/:id", verifyJWT, postController.updatePost); //Done
router.delete("/:id", verifyJWT, postController.deletePost); //!Fix
router.get("/find/:id", postController.getPost); //Done
router.put("/view/:id", postController.addView); //Done
router.put("/like/:id", verifyJWT, postController.likePost); //Done
router.get("/:postId/comments", postController.getComments);

//! Need to test
router.get("/trend", postController.getRandom);
router.get("/random", postController.getTrend);
router.get("/sub", verifyJWT, postController.getSub);
router.get("/tags", postController.getByTag);
router.get("/search", postController.searchPost);

module.exports = router;

//TODO Comment a post
