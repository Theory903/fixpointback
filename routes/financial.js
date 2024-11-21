const express = require("express");
const fs = require("fs");
const csvParser = require("csv-parser");
const router = express.Router();

const FINANCIAL_CSV = "./data/financial.csv";

// Get Financial Data
router.get("/", (req, res) => {
  const financialData = [];
  fs.createReadStream(FINANCIAL_CSV)
    .pipe(csvParser())
    .on("data", (data) => financialData.push(data))
    .on("end", () => res.json(financialData))
    .on("error", (err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
