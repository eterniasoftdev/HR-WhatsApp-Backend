const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

// const { Server } = require("socket.io");
const http = require("http");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// const { DataStore } = require("./lib/dataStore");
const port = 3006;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is Working on  http://localhost:${port}`);
});
