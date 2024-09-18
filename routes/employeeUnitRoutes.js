const express = require("express");
const router = express.Router();
const {
  addEmployeeUnit,
  updateEmployeeUnit,
  getAllEmployeeUnits,
  activateEmployeeUnit,
  deactivateEmployeeUnit,
} = require("../controllers/employeeUnitController");

// Route to add an employee unit
router.post("/", addEmployeeUnit);

// Route to update an employee unit
router.put("/:id", updateEmployeeUnit);

// Route to get all employee units
router.get("/", getAllEmployeeUnits);

// Route to activate an employee unit
router.patch("/activate/:id", activateEmployeeUnit);

// Route to deactivate an employee unit
router.patch("/deactivate/:id", deactivateEmployeeUnit);

module.exports = router;
