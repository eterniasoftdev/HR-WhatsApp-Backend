const db = require("../db/db");

// Create Fact
exports.createFact = async (req, res) => {
  const {
    message,
    fact_type_id,
    week,
    position = 0,
    day,
    is_dynamic,
    dynamic_data,
    as_on,
  } = req.body; // Added week and position to the body
  try {
    const result = await db.query(
      `
      INSERT INTO facts (message, fact_type_id, week, position,day,is_dynamic,dynamic_data,as_on) 
      VALUES ($1, $2, $3, $4,$5,$6,$7,$8) 
      RETURNING *
      `,
      [
        message,
        fact_type_id,
        week,
        position,
        day,
        is_dynamic,
        dynamic_data,
        as_on,
      ] // Use 0 as default for position
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while creating the fact.");
  }
};

// Get All Facts (sorted by week and position)
exports.getAllFacts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        f.id, 
        f.message, 
        f.week, 
        f.position, 
        f.is_active, 
        f.day,
        f.is_dynamic,
        f.dynamic_data,
        f.as_on,
        f.fact_type_id, 
        ft.type AS fact_type_name 
      FROM facts f
      JOIN fact_type ft ON f.fact_type_id = ft.id
      ORDER BY  f.week ASC, f.day ASC, f.position ASC
    `); // Sorting facts first by week, then by position

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send("An error occurred while retrieving the facts.");
  }
};

// Deactivate Fact
exports.deactivateFact = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `
      UPDATE facts 
      SET is_active = false 
      WHERE id = $1 
      RETURNING *
      `,
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while deactivating the fact.");
  }
};

// Activate Fact
exports.activateFact = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `
      UPDATE facts 
      SET is_active = true 
      WHERE id = $1 
      RETURNING *
      `,
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while activating the fact.");
  }
};

// Update multiple facts' positions and weeks
exports.updateMultipleFacts = async (req, res) => {
  const { data } = req.body;

  // Build query cases for position and week
  const factIds = data.map((item) => item.id);
  const queryCasesPosition = data
    .map(({ id, position }) => `WHEN id = ${id} THEN ${position}`)
    .join(" ");
  try {
    // Single query to update all facts' positions and weeks
    await db.query(`
      UPDATE facts
      SET position = CASE ${queryCasesPosition} END
      WHERE id IN (${factIds.join(", ")})
    `);

    res.status(200).json({ message: "Facts updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating facts" });
  }
};

// Update a single fact by fact_id in params
exports.updateFactById = async (req, res) => {
  const { id } = req.params;
  const {
    message,
    fact_type_id,
    position,
    week,
    day,
    is_dynamic,
    dynamic_data,
    as_on,
  } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE facts
      SET message = $1,
          fact_type_id = $2,
          position = $3,
          week = $4,
          day=$5,
          is_dynamic=$6,
          dynamic_data=$7,
          as_on=$8
      WHERE id = $9
      RETURNING *
      `,
      [
        message,
        fact_type_id,
        position,
        week,
        day,
        is_dynamic,
        dynamic_data,
        as_on,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Fact not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the fact" });
  }
};
