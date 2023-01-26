const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/", tagController.getAllTags); //Done
router.post("/", verifyJWT, tagController.createNewTag); //Done
router.put("/:id", verifyJWT, tagController.updateTag); // Done
router.delete("/:id", verifyJWT, tagController.deleteTag); // Done
router.get("/find/:id", tagController.getTag); //Done
router.get("/post/:id", tagController.getTagsByPostId); //Done
router.get("/user/:id", tagController.getTagsByUserId); //Done
router.get("/search", tagController.searchTag); //Done
router.get("/realted/:id", tagController.getRelatedTags); //Done
router.get("/trending", tagController.getTrendingTags);

module.exports = router;

//! Need to figure some kind of auth for tags. Not everyone should be able to modify
