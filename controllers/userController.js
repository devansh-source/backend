import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await User.create({ username, email, password });

    // Send a Welcome Email
    const message = `<h1>Welcome, ${user.username}!</h1><p>Thanks for registering.</p>`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to the Inventory System!",
        html: message,
      });
      console.log("Welcome email sent to:", user.email);
    } catch (err) {
      console.error("Welcome email could not be sent:", err);
      // Not returning an error to the user, as email failure shouldn't block registration
    }

    // Generate token and respond
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "Registration successful!",
      token,
      username: user.username,
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Please provide username and password" });
    }
    
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