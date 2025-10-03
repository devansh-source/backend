// server/app.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";

dotenv.config();
const app = express();

// ----------------------
// CORS Configuration
// ----------------------
const corsOptions = {
  origin: "*", // ya specific frontend URL: "https://frontend-df12bu27x-devanshs-projects-ea26e1e0.vercel.app"
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// ----------------------
// Middleware
// ----------------------
app.use(express.json());

// ----------------------
// Routes
// ----------------------
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Inventory Management System Backend Running!");
});

// ----------------------
// MongoDB Connection
// ----------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
