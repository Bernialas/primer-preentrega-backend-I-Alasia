const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor(filename = 'data/products.json') {
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
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  async getAll() {
    return await this._readFile();
  }

  async getById(pid) {
    const products = await this._readFile();
    return products.find(p => p.id === pid || p.id == pid) || null;
  }

  async add(data) {
    const required = ['title','description','code','price','status','stock','category','thumbnails'];
    for (const field of required) {
      if (data[field] === undefined) {
        throw new Error(`Falta el campo: ${field}`);
      }
    }

    const products = await this._readFile();
    if (products.some(p => p.code === data.code)) throw new Error('El code ya existe');

    const newProduct = {
      id: this._generateId(),
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      status: Boolean(data.status),
      thumbnails: Array.isArray(data.thumbnails) ? data.thumbnails : []
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async update(pid, data) {
    const products = await this._readFile();
    const idx = products.findIndex(p => p.id === pid || p.id == pid);
    if (idx < 0) return null;
    delete data.id;
    products[idx] = { ...products[idx], ...data };
    await this._writeFile(products);
    return products[idx];
  }

  async delete(pid) {
    const products = await this._readFile();
    const idx = products.findIndex(p => p.id === pid || p.id == pid);
    if (idx < 0) return false;
    products.splice(idx, 1);
    await this._writeFile(products);
    return true;
  }
}

module.exports = ProductManager;
