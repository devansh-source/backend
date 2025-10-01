import express from "express";
import { addProduct, getProducts, deleteProduct, updateProduct } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", protect, addProduct);
router.get("/", protect, getProducts);
router.delete("/:id", protect, deleteProduct);
router.put("/:id", protect, updateProduct);

export default router;
