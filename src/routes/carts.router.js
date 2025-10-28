const express = require('express');
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();

const cm = new CartManager();
const pm = new ProductManager();

router.post('/', async (req, res) => {
  res.status(201).json(await cm.createCart());
});

router.get('/:cid', async (req, res) => {
  const cart = await cm.getById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const product = await pm.getById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no existe' });
  const cart = await cm.addProductToCart(cid, pid, 1);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

module.exports = router;
