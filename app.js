import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";

dotenv.config();
const app = express();

// Middlewares
// CHANGE: Allowed origins ko ek array mein daalein
const allowedOrigins = [
  "http://localhost:3000", // Aapke local development ke liye
  "https://frontend-sigma-nine-63.vercel.app" // Aapka naya Vercel URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Agar request ka origin allowedOrigins mein hai, to allow karein
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Inventory Management System Backend Running!");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});