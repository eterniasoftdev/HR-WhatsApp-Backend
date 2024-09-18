const db = require("../db/db"); // Assuming you have db connection set up

// Add Employee Function
exports.addEmployeeFunction = async (req, res) => {
  const { function_name } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO employee_functions (function_name) VALUES ($1) RETURNING *",
      [function_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Update Employee Function
exports.updateEmployeeFunction = async (req, res) => {
  const { function_name } = req.body;
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE employee_functions SET function_name = $1 WHERE id = $2 RETURNING *",
      [function_name, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get All Employee Functions
exports.getAllEmployeeFunctions = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM employee_functions ORDER BY function_name ASC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Activate Employee Function
exports.activateEmployeeFunction = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE employee_functions SET is_active = TRUE WHERE id = $1 RETURNING *",
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Deactivate Employee Function
exports.deactivateEmployeeFunction = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE employee_functions SET is_active = FALSE WHERE id = $1 RETURNING *",
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};
