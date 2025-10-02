// server/controllers/userController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ error: "Username already exists" });

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ error: "Email already in use" });

    const user = await User.create({
      username,
      email,
      password,
    });

    // Send a Welcome Email
    const message = `<h1>Welcome, ${user.username}!</h1><p>Thanks for registering with the Inventory System. You can now log in.</p>`;
    
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to the Inventory System!",
        html: message,
      });
    } catch (emailError) {
      console.error("Welcome email could not be sent:", emailError);
      // Note: We don't block registration if email fails, just log the error.
    }
    
    res.status(201).json({ message: "Registration successful! Check your email." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, username: user.username });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login." });
  }
};