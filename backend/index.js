const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Temporary user storage
const users = [];


const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Medicall backend is running 🚀");
});

// Register user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store user
  users.push({ username, password: hashedPassword });
  res.json({ message: "User registered successfully" });
});


// Login user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid password" });

  // Generate JWT token
  const token = jwt.sign({ username }, "SECRET_KEY", { expiresIn: "1h" });

  res.json({ message: "Login successful", token });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
