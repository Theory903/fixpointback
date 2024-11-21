const express = require("express");
const fs = require("fs");
const csvParser = require("csv-parser");
const router = express.Router();

const SERVICES_CSV = "./data/services.csv";

// Get All Services
router.get("/", (req, res) => {
  const services = [];
  fs.createReadStream(SERVICES_CSV)
    .pipe(csvParser())
    .on("data", (data) => services.push(data))
    .on("end", () => res.json(services))
    .on("error", (err) => res.status(500).json({ error: err.message }));
});

// Add Service Order
router.post("/", (req, res) => {
  const newService = req.body;
  const row = `${Object.values(newService).join(",")}\n`;
  fs.appendFile(SERVICES_CSV, row, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Service order added successfully" });
  });
});

module.exports = router;