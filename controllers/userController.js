import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  // Add a try...catch block to handle all potential errors
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    // --- Send a Welcome Email ---
    const message = `<h1>Welcome, ${user.username}!</h1><p>Thanks for registering. You can now log in.</p>`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to the Inventory System!",
        html: message,
      });
      console.log(`Welcome email sent to: ${user.email}`);
    } catch (emailError) {
      // Log the error but don't stop the registration process
      console.error("Welcome email could not be sent:", emailError);
    }
    
    res.status(201).json({ message: "Registration successful! You can now log in." });

  } catch (error) {
    // Catch any server-side errors and send a proper response
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  // Add a try...catch block to handle all potential errors
  try {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Please provide username and password" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      // Use 401 for unauthorized access
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Use 401 for unauthorized access
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, username: user.username });

  } catch (error) {
    // Catch any server-side errors and send a proper response
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};