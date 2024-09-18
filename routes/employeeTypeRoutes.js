const express = require("express");
const router = express.Router();
const {
  createEmployeeType,
  updateEmployeeType,
  getAllEmployeeTypes,
  deleteEmployeeType,
  activateEmployeeType,
  deactivateEmployeeType,
} = require("../controllers/employeeTypeController");

// Route to create an employee type
router.post("/", createEmployeeType);

// Route to update an employee type
router.put("/:id", updateEmployeeType);

// Route to get all employee types
router.get("/", getAllEmployeeTypes);

// Route to delete an employee type
router.delete("/:id", deleteEmployeeType);

// Route to activate an employee type
router.patch("/activate/:id", activateEmployeeType);

// Route to deactivate an employee type
router.patch("/deactivate/:id", deactivateEmployeeType);

module.exports = router;
