const express = require("express");
const schedulerController = require("../controllers/schedulerController");

const router = express.Router();

// Scheduler routes
router.post("/", schedulerController.createScheduler); // Create new schedule
router.get("/", schedulerController.getAllSchedules); // Get all schedules
router.put("/deactivate/:id", schedulerController.deactivateScheduler); // Deactivate schedule
router.put("/activate/:id", schedulerController.activateScheduler); // Activate schedule

module.exports = router;
