const express = require("express");
const fs = require("fs");
const os = require("os");
const dns = require("dns");

const app = express();
const PORT = 3000;

const FILE = "./students.json";

// GET all students
app.get("/students", (req, res) => {
    fs.readFile(FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading student data");
        }

        const students = JSON.parse(data);
        res.json(students);
    });
});

// GET student by ID
app.get("/students/:id", (req, res) => {
    fs.readFile(FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading student data");
        }

        const students = JSON.parse(data);
        const id = parseInt(req.params.id);

        const student = students.find(s => s.id === id);

        if (student) {
            res.json(student);
        } else {
            res.status(404).send("Student not found");
        }
    });
});

// GET students by course
app.get("/search", (req, res) => {
    fs.readFile(FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading student data");
        }

        const students = JSON.parse(data);
        const course = req.query.course;

        const result = students.filter(
            student => student.course.toLowerCase() === course.toLowerCase()
        );

        res.json(result);
    });
});

// GET system information
app.get("/system", (req, res) => {
    res.json({
        platform: os.platform(),
        architecture: os.arch(),
        hostname: os.hostname(),
        cpus: os.cpus().length,
        memory: os.totalmem()
    });
});

// GET DNS information
app.get("/dns", (req, res) => {
    dns.lookup("google.com", (err, address, family) => {
        if (err) {
            return res.status(500).send("DNS lookup failed");
        }

        res.json({
            hostname: "google.com",
            address: address,
            family: family
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});