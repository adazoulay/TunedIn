const express = require("express");
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/signin", loginLimiter, authController.signin);

router.post("/signout", authController.signout);

router.get("/refresh", authController.refresh);

// Spotify

router.get("/spotifySignIn", authController.spotifySignIn);

router.get("/spotifyCallback", authController.spotifyCallback);

module.exports = router;
