import express from "express";
import { addSale, getSales } from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", protect, addSale);
router.get("/", protect, getSales);

export default router;
