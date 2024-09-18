const express = require("express");
const employeeController = require("../controllers/employeeController");

const router = express.Router();

// Employee routes
router.post("/", employeeController.createEmployee);
router.patch("/:id", employeeController.updateEmployee);
router.get("/", employeeController.getAllEmployees); // Get all employees
router.get("/type/:employee_type_id", employeeController.getEmployeesByType); // Get employees by type
router.put("/deactivate/:id", employeeController.deactivateEmployee);
router.put("/activate/:id", employeeController.activateEmployee);

module.exports = router;
