const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const db = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12799518",
    password: "smSl9M2env",
    database: "sql12799518",
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL database!");
});

// POST /input
app.post("/input", (req, res) => {
    const { fullname, email } = req.body;
    console.log("Received POST /input:", req.body);
    console.log(fullname,email);

    if (!fullname || !email) {
        console.warn("Missing fullname or email");
        return res.status(400).json({ error: "fullname and email required" });
    }

    const sql = "INSERT INTO users (fullname, email) VALUES (?, ?)";
    db.query(sql, [fullname, email], (err, result) => {
        if (err) {
            console.error("Insert error:", err); // log full error
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: err.message });
        }
        console.log("Insert successful, ID:", result.insertId);
        res.json({ message: "User added successfully", id: result.insertId });
    });
});

// GET /verify
app.get("/verify", (req, res) => {
    const email = req.query.email;
    console.log("Received GET /verify for email:", email);

    if (!email) {
        console.warn("Missing email in query");
        return res.status(400).json({ error: "email required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Select error:", err); // log full error
            return res.status(500).json({ error: err.message });
        }
        console.log("Select results:", results);
        if (results.length > 0) res.json({ verified: true, data: results[0] });
        else res.json({ verified: false });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
