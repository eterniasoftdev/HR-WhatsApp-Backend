const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", // replace with your PostgreSQL username
  host: "localhost", // database host, usually 'localhost'
  database: "hrsystem", // replace with your database name
  password: "", // replace with your PostgreSQL password
  port: 5432, // default PostgreSQL port
});

// Function to query the database
const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = {
  query,
  pool,
};
