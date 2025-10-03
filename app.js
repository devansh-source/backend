import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors({
  origin: "https://your-frontend.vercel.app", // replace with your frontend URL
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

let users = []; // Simple in-memory storage

// Registration
app.post("/api/users/register", (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  users.push({ name, email, password });
  res.json({ message: "Registration successful" });
});

// Login
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: "Invalid email or password" });

  res.json({ message: "Login successful", name: user.name });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
