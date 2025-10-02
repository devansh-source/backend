import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// --- Nodemailer setup ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER, // tumhara gmail
    pass: process.env.EMAIL_PASS, // app password
  },
});

// Function to send welcome email
const sendWelcomeEmail = async (toEmail, username) => {
  const message = `
    <h1>Welcome, ${username}!</h1>
    <p>Thanks for registering. You can now log in to your account.</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Inventory App" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Welcome to Inventory System",
      html: message,
    });
    console.log("Welcome email sent to:", toEmail);
  } catch (err) {
    console.error("Welcome email could not be sent:", err);
  }
};

// --- Register User ---
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user or email exists
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ error: "Username already exists" });

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ error: "Email already in use" });

    // Create user
    const user = await User.create({ username, email, password });

    // Send welcome email
    sendWelcomeEmail(email, username);

    // Response for frontend pop message
    res.status(201).json({ message: "Registration successful! You can now log in." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- Login User ---
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) return res.status(400).json({ error: "Invalid username or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, username: user.username });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
