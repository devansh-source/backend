import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

export const addSale = async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(400).json({ error: "Product not found" });
  if (quantity > product.quantity) return res.status(400).json({ error: "Not enough stock" });

  product.quantity -= quantity;
  await product.save();

  const sale = await Sale.create({
    product: productId,
    quantity,
    totalPrice: quantity * product.price
  });

  res.status(201).json(sale);
};

export const getSales = async (req, res) => {
  const sales = await Sale.find().populate("product");
  res.json(sales);
};
