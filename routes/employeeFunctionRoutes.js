const express = require("express");
const router = express.Router();
const {
  addEmployeeFunction,
  updateEmployeeFunction,
  getAllEmployeeFunctions,
  activateEmployeeFunction,
  deactivateEmployeeFunction,
} = require("../controllers/employeeFunctionController");

// Route to add an employee function
router.post("/", addEmployeeFunction);

// Route to update an employee function
router.put("/:id", updateEmployeeFunction);

// Route to get all employee functions
router.get("/", getAllEmployeeFunctions);

// Route to activate an employee function
router.patch("/activate/:id", activateEmployeeFunction);

// Route to deactivate an employee function
router.patch("/deactivate/:id", deactivateEmployeeFunction);

module.exports = router;
