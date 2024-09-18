const db = require("../db/db");

// Create Scheduler
exports.createScheduler = async (req, res) => {
  const {
    frequency,
    start_time,
    fact_type_id,
    employee_type_id,
    is_active = true,
  } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO scheduler (frequency, start_time, is_active, fact_type_id, employee_type_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [frequency, start_time, is_active, fact_type_id, employee_type_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get All Schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM scheduler");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Deactivate Scheduler
exports.deactivateScheduler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "UPDATE scheduler SET is_active = false WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Activate Scheduler
exports.activateScheduler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "UPDATE scheduler SET is_active = true WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};
