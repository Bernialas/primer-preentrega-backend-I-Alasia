const express = require('express');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas base
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta raíz
app.get('/', (req, res) => res.send('API e-commerce - Entrega N°1'));

// 404
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
