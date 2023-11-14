const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");

router.post("/userSignup", userController.userSignup);
router.post("/userLogin", userController.userLogin);
router.put("/updateUser/:id", userController.updateUser);
router.put("/deleteUser/:id", userController.deleteUser);

module.exports = router;
