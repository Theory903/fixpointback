const express = require("express");
const fs = require("fs");
const csvParser = require("csv-parser");
const router = express.Router();

const APPOINTMENTS_CSV = "./data/appointments.csv";

// Get All Appointments
router.get("/", (req, res) => {
  const appointments = [];
  fs.createReadStream(APPOINTMENTS_CSV)
    .pipe(csvParser())
    .on("data", (data) => appointments.push(data))
    .on("end", () => res.json(appointments))
    .on("error", (err) => res.status(500).json({ error: err.message }));
});

// Add a New Appointment
router.post("/", (req, res) => {
  const newAppointment = req.body;
  const row = `${Object.values(newAppointment).join(",")}\n`;

  fs.appendFile(APPOINTMENTS_CSV, row, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Appointment added successfully" });
  });
});

// Search Appointments by Name or Date
router.get("/search", (req, res) => {
  const { name, date } = req.query;
  const appointments = [];
  
  fs.createReadStream(APPOINTMENTS_CSV)
    .pipe(csvParser())
    .on("data", (data) => {
      const matchesName = name ? data.customerName.toLowerCase().includes(name.toLowerCase()) : true;
      const matchesDate = date ? data.date === date : true;

      if (matchesName && matchesDate) {
        appointments.push(data);
      }
    })
    .on("end", () => res.json(appointments))
    .on("error", (err) => res.status(500).json({ error: err.message }));
});

module.exports = router;