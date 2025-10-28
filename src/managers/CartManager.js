const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(filename = 'data/carts.json') {
    this.path = path.resolve(filename);
  }

  async _readFile() {
    try {
      const content = await fs.readFile(this.path, 'utf8');
      return JSON.parse(content || '[]');
    } catch (err) {
      if (err.code === 'ENOENT') {
        await this._writeFile([]);
        return [];
      }
      throw err;
    }
  }

  async _writeFile(data) {
    await fs.mkdir(path.dirname(this.path), { recursive: true });
    await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf8');
  }

  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  }

  async createCart() {
    const carts = await this._readFile();
    const newCart = { id: this._generateId(), products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getById(cid) {
    const carts = await this._readFile();
    return carts.find(c => c.id === cid || c.id == cid) || null;
  }

  async addProductToCart(cid, pid, qty = 1) {
    const carts = await this._readFile();
    const idx = carts.findIndex(c => c.id === cid || c.id == cid);
    if (idx < 0) return null;

    const cart = carts[idx];
    const productIndex = cart.products.findIndex(p => p.product === pid || p.product == pid);
    if (productIndex >= 0) {
      cart.products[productIndex].quantity += qty;
    } else {
      cart.products.push({ product: pid, quantity: qty });
    }

    carts[idx] = cart;
    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;
