const db = require("../db/db");

// Create Employee
exports.createEmployee = async (req, res) => {
  const {
    name,
    mobile,
    employee_type_id,
    employee_unit_id,
    employee_function_id,
    poornata_id,
  } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO employee 
        (name, mobile, employee_type_id, employee_unit_id, employee_function_id, poornata_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        name,
        mobile,
        employee_type_id,
        employee_unit_id,
        employee_function_id,
        poornata_id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

///Update Employee
exports.updateEmployee = async (req, res) => {
  const {
    name,
    mobile,
    employee_type_id,
    employee_unit_id,
    employee_function_id,
    poornata_id,
  } = req.body;

  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE employee 
       SET name = $1, mobile = $2, employee_type_id = $3, employee_unit_id = $4, employee_function_id = $5, poornata_id = $6
       WHERE id = $7
       RETURNING *`,
      [
        name,
        mobile,
        employee_type_id,
        employee_unit_id,
        employee_function_id,
        poornata_id,
        id,
      ]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        e.id,
        e.name,
        e.mobile,
        e.employee_type_id,
        e.employee_unit_id,
        e.employee_function_id,
        e.is_active,
        e.poornata_id,
        e.created_on,
        et.type AS employee_type,
        eu.unit_name AS employee_unit,
        ef.function_name AS employee_function
      FROM employee e
      LEFT JOIN employee_type et ON e.employee_type_id = et.id
      LEFT JOIN employee_unit eu ON e.employee_unit_id = eu.id
      LEFT JOIN employee_functions ef ON e.employee_function_id = ef.id
      ORDER BY name ASC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get Employees by Employee Type ID
exports.getEmployeesByType = async (req, res) => {
  const { employee_type_id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM employee WHERE employee_type_id = $1 ORDER BY name ASC",
      [employee_type_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Deactivate Employee
exports.deactivateEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "UPDATE employee SET is_active = false WHERE id = $1 RETURNING *",
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Activate Employee
exports.activateEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "UPDATE employee SET is_active = true WHERE id = $1 RETURNING *",
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};
