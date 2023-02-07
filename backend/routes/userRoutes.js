const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser)
  .patch(verifyJWT, userController.updateUser)
  .delete(verifyJWT, userController.deleteUser);

//! Find
router.get("/find/:id", userController.getUser);
router.get("/post/:id", userController.getUserByPostId);
router.get("/search", userController.searchUser);

//! Follow / Add
router.put("/follow/:id", verifyJWT, userController.follow);
router.put("/unfollow/:id", verifyJWT, userController.unFollow);
router.put("/followTag/:id", verifyJWT, userController.followTag);
router.put("/unfollowTag/:id", verifyJWT, userController.unFollowTag);

//! Mutate
//router.delete("/:id", userController.deleteUser); //!Fix

module.exports = router;
