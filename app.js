import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";

dotenv.config();
const app = express();

// ======= CORS SETUP =======
app.use(cors({
  origin: "https://frontend-df12bu27x-devanshs-projects-ea26e1e0.vercel.app", // Your frontend URL
  credentials: true
}));

// ======= MIDDLEWARE =======
app.use(express.json());

// ======= ROUTES =======
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
