const express = require('express');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();
const pm = new ProductManager();

router.get('/', async (req, res) => {
  try {
    res.json(await pm.getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:pid', async (req, res) => {
  const product = await pm.getById(req.params.pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.post('/', async (req, res) => {
  try {
    const nuevo = await pm.add(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:pid', async (req, res) => {
  const actualizado = await pm.update(req.params.pid, req.body);
  if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(actualizado);
});

router.delete('/:pid', async (req, res) => {
  const ok = await pm.delete(req.params.pid);
  if (!ok) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ message: 'Producto eliminado' });
});

module.exports = router;
