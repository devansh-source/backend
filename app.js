import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: "https://frontend-df12bu27x-devanshs-projects-ea26e1e0.vercel.app", // Vercel frontend
  credentials: true,
}));

app.use(express.json());

// Temporary "database" (in-memory)
const users = [];

// Register route
app.post("/api/users/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields required" });

  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ message: "User already exists" });

  users.push({ email, password });
  res.json({ message: "Registered successfully!" });
});

// Login route
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  res.json({ message: "Login successful!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
