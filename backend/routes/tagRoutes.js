const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/", tagController.getAllTags); //Done
router.post("/", verifyJWT, tagController.createNewTag); //Done
router.put("/:id", verifyJWT, tagController.updateTag); // Done
router.delete("/:id", verifyJWT, tagController.deleteTag); // Done
router.get("/find/:id", tagController.getTag); //Done

module.exports = router;

//! Need to figure some kind of auth for tags. Not everyone should be able to modify