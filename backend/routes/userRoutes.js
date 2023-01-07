const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser)
  .patch(verifyJWT, userController.updateUser)
  .delete(verifyJWT, userController.deleteUser); //!Fix

//router.delete("/:id", userController.deleteUser);
router.get("/find/:id", userController.getUser);
router.put("/follow/:id", verifyJWT, userController.follow);
router.put("/unFollow/:id", verifyJWT, userController.unFollow);

module.exports = router;

//! Decide comments, liked comments after
//! Decide Tags / following tags