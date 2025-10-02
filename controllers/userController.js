import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

// --- Register User ---
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user or email exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await User.create({ username, email, password });

    const message = `<h1>Welcome, ${user.username}!</h1><p>Thanks for registering. You can now log in.</p>`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to the Inventory System!",
        html: message,
      });
      console.log("Welcome email sent to:", user.email);
    } catch (emailError) {
      console.error("Welcome email could not be sent:", emailError);
    }
    
    res.status(201).json({ message: "Registration successful! You can now log in." });

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// --- Login User ---
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, username: user.username });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};