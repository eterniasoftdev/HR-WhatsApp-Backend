const db = require("../db/db");

// Create Fact Type
exports.createFactType = async (req, res) => {
  const { type, is_active = true } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO fact_type (type, is_active) VALUES ($1, $2) RETURNING *",
      [type, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send(err);
  }
};

// Get All Fact Types
exports.getAllFactTypes = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM fact_type ORDER BY type ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Deactivate Fact Type
exports.deactivateFactType = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "UPDATE fact_type SET is_active = false WHERE id = $1 RETURNING *",
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Activate Fact Type
exports.activateFactType = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "UPDATE fact_type SET is_active = true WHERE id = $1 RETURNING *",
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateFactTypeById = async (req, res) => {
  const { id } = req.params;
  const { type, is_active } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE fact_type
      SET type = $1, is_active = $2
      WHERE id = $3
      RETURNING *
      `,
      [type, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Fact type not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the fact type" });
  }
};
