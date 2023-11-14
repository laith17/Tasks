const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");
const verifyMiddleware = require("../middlewares/verify");

router.post(
  "/createTask",
  verifyMiddleware.verifyJWT,
  tasksController.createTask
);
router.get(
  "/getAllTasks",
  verifyMiddleware.verifyJWT,
  tasksController.getAllTasks
);
router.get("/getTaskById/:id", tasksController.getTaskById);
router.put("/updateTask/:id", tasksController.updateTask);
router.put("/deleteTask/:id", tasksController.deleteTask);

module.exports = router;
