import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  const { name, quantity, price } = req.body;
  const product = await Product.create({ name, quantity, price });
  res.status(201).json(product);
};

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted", product });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
};
