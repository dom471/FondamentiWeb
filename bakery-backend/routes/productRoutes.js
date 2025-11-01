import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET tutti i prodotti
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero prodotti" });
  }
});

// POST nuovo prodotto
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Errore nella creazione del prodotto" });
  }
});

// POST /api/products, se sono  proprietario posso aggiungere un nuovo prodotto 
router.post("/", async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const newProduct = new Product({ name, price, image });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Errore nella creazione del prodotto" });
  }
});

// PUT /api/products/:id, posso  modificare un prodotto
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Errore nella modifica del prodotto" });
  }
});

// DELETE /api/products/:id elimina un prodotto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Prodotto eliminato" });
  } catch (err) {
    res.status(400).json({ error: "Errore nell'eliminazione del prodotto" });
  }
});


export default router;
