const express = require("express");
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

const router = express.Router();

router.post("/signup", authController.signup); // Tested

router.post("/signin", loginLimiter, authController.signin); // Tested

router.post("/signout", authController.signout); // Tested

router.get("/refresh", authController.refresh); // Tested

module.exports = router;
