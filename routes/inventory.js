const express = require("express");
const fs = require("fs");
const csvParser = require("csv-parser");
const router = express.Router();

const INVENTORY_CSV = "./data/inventory.csv";

// Get All Inventory Items
router.get("/", (req, res) => {
  const inventory = [];
  fs.createReadStream(INVENTORY_CSV)
    .pipe(csvParser())
    .on("data", (data) => inventory.push(data))
    .on("end", () => res.json(inventory))
    .on("error", (err) => res.status(500).json({ error: err.message }));
});

// Add Inventory Item
router.post("/", (req, res) => {
  const newItem = req.body;
  const row = `${Object.values(newItem).join(",")}\n`;
  fs.appendFile(INVENTORY_CSV, row, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Inventory item added successfully" });
  });
});

module.exports = router;