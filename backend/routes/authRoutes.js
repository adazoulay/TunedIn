const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Create a USER
router.post("/signup", authController.signup); // Tested
// SIGN IN
router.post("/signin", authController.signin); // Tested

module.exports = router;
