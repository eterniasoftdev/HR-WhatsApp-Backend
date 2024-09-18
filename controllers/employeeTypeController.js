const db = require("../db/db");

// Create Employee Type
exports.createEmployeeType = async (req, res) => {
  const { type } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO employee_type (type) VALUES ($1) RETURNING *",
      [type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Read Employee Types
exports.getAllEmployeeTypes = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM employee_type ORDER BY type ASC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Update Employee Type
exports.updateEmployeeType = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  try {
    const result = await db.query(
      "UPDATE employee_type SET type = $1 WHERE id = $2 RETURNING *",
      [type, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Delete Employee Type
exports.deleteEmployeeType = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM employee_type WHERE id = $1", [id]);
    res.json({ message: "Employee type deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
};

// Activate Employee Type
exports.activateEmployeeType = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "UPDATE employee_type SET is_active = TRUE WHERE id = $1 RETURNING *",
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Deactivate Employee Type
exports.deactivateEmployeeType = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "UPDATE employee_type SET is_active = FALSE WHERE id = $1 RETURNING *",
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};
