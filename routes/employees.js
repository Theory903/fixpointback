const express = require("express");
const fs = require("fs");
const csvParser = require("csv-parser");
const { parse } = require("json2csv");

const router = express.Router();

const EMPLOYEES_CSV = "./data/employees.csv";

// Helper: Read All Employees from CSV
const readEmployees = () =>
  new Promise((resolve, reject) => {
    const employees = [];
    fs.createReadStream(EMPLOYEES_CSV)
      .pipe(csvParser())
      .on("data", (data) => employees.push(data))
      .on("end", () => resolve(employees))
      .on("error", (err) => reject(err));
  });

// Helper: Write Employees to CSV
const writeEmployees = (employees) =>
  new Promise((resolve, reject) => {
    const csvData = parse(employees, { fields: ["id", "name", "role", "attendance", "performance", "tags", "status"] });
    fs.writeFile(EMPLOYEES_CSV, csvData, "utf8", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

// Get All Employees
router.get("/", async (req, res) => {
  try {
    const employees = await readEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Employee
router.post("/", async (req, res) => {
  try {
    const employees = await readEmployees();
    const newEmployee = {
      ...req.body,
      id: employees.length + 1,
    };
    employees.push(newEmployee);
    await writeEmployees(employees);
    res.json({ message: "Employee added successfully", newEmployee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Employee
router.put("/:id", async (req, res) => {
  try {
    const employees = await readEmployees();
    const { id } = req.params;
    const employeeIndex = employees.findIndex((emp) => emp.id === id);

    if (employeeIndex === -1) {
      return res.status(404).json({ error: "Employee not found" });
    }

    employees[employeeIndex] = { ...employees[employeeIndex], ...req.body };
    await writeEmployees(employees);
    res.json({ message: "Employee updated successfully", updatedEmployee: employees[employeeIndex] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Employee
router.delete("/:id", async (req, res) => {
  try {
    const employees = await readEmployees();
    const { id } = req.params;
    const filteredEmployees = employees.filter((emp) => emp.id !== id);

    if (employees.length === filteredEmployees.length) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await writeEmployees(filteredEmployees);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;