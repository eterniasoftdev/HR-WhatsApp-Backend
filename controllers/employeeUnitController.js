const db = require("../db/db");
// Add Employee Unit
exports.addEmployeeUnit = async (req, res) => {
  const { unit_name } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO employee_unit (unit_name) VALUES ($1) RETURNING *",
      [unit_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Update Employee Unit
exports.updateEmployeeUnit = async (req, res) => {
  const { unit_name } = req.body;
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE employee_unit SET unit_name = $1 WHERE id = $2 RETURNING *",
      [unit_name, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get All Employee Units
exports.getAllEmployeeUnits = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM employee_unit ORDER BY unit_name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Activate Employee Unit
exports.activateEmployeeUnit = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE employee_unit SET is_active = TRUE WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Deactivate Employee Unit
exports.deactivateEmployeeUnit = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE employee_unit SET is_active = FALSE WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};
