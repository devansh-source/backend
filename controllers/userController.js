import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user/email exists
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ error: "Username already exists" });

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ error: "Email already in use" });

    // Create user
    const user = await User.create({ username, email, password });

    // Setup Nodemailer (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Inventory App 🎉",
      html: `<h1>Hi ${username}!</h1><p>Thanks for registering. You can now log in.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log("Email send error:", err);
      else console.log("Welcome email sent:", info.response);
    });

    // Send JSON response to frontend
    res.status(201).json({ message: "Registration successful! Please check your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed. Try again later." });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  });

  if (!user) return res.status(400).json({ error: "Invalid username or password" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ error: "Invalid username or password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, username: user.username });
};
