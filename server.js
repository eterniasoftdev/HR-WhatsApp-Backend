const express = require("express");
const employeeTypeRoutes = require("./routes/employeeTypeRoutes");
const employeeFunctionRoutes = require("./routes/employeeFunctionRoutes");
const employeeUnitRoutes = require("./routes/employeeUnitRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const schedulerRoutes = require("./routes/schedulerRoutes");
const factTypeRoutes = require("./routes/factTypeRoutes");
const factsRoutes = require("./routes/factsRoutes");
const socketRoute = require("./routes/socketRoute");
const dotenv = require("dotenv");
const cors = require("cors");
//////////Creating Schedular Service///////
require("./lib/SchedulerService");
/////////////////////////////////////////
dotenv.config({ path: "./config.env" });
const app = express();
app.use(cors());
app.use(express.json());

// Add all the routes to the app
app.use("/api/v1/socket", socketRoute);
app.use("/api/employees", employeeRoutes);
app.use("/api/employee_type", employeeTypeRoutes);
app.use("/api/employee_function", employeeFunctionRoutes);
app.use("/api/employee_unit", employeeUnitRoutes);
app.use("/api/scheduler", schedulerRoutes);
app.use("/api/fact_type", factTypeRoutes);
app.use("/api/facts", factsRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
