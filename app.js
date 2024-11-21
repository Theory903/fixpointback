const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const employeeRoutes = require("./routes/employees");
const inventoryRoutes = require("./routes/inventory");
const serviceRoutes = require("./routes/services");
const financialRoutes = require("./routes/financial");
const appointmentRoutes = require("./routes/appointments");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/financial", financialRoutes);
app.use("/api/appointments", appointmentRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});