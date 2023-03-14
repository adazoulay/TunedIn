const express = require("express");
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/signin", loginLimiter, authController.signin);

router.post("/signout", authController.signout);

router.get("/refresh", authController.refresh);

// Spotify

router.get("/authWithSpotify", authController.authWithSpotify);

router.get("/spotifyAuthCallback", authController.spotifyAuthCallback);

router.get("/spotify/:jwtToken", authController.connectToSpotify);

router.get("/spotifyCallback", authController.spotifyCallback);

router.get("/spotifyRefresh", verifyJWT, authController.spotifyRefresh);

router.get("/spotifyTempAuth", verifyJWT, authController.spotifyTempAuth);

router.post("/spotifyDisconnect", verifyJWT, authController.spotifyDisconnect);

module.exports = router;
