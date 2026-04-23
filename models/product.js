const db = require('../utils/database');

class Product {
  constructor(id, name, price, old_price, badge, rating, reviews, description, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.old_price = old_price;
    this.badge = badge;
    this.rating = rating;
    this.reviews = reviews;
    this.description = description;
    this.image = image;
  }

  static async fetchProducts() {
    const [rows] = await db.execute('select * from products');
    return rows;
  }

  static async fetchProductById(id) {
    const [rows] = await db.execute('select * from products where id = ?', [id]);
    return rows[0] ?? null;
  }

  static async deleteProduct(id) {
    await db.execute('delete from products where id = ?', [id]);
  }

  saveProduct() {
    return db.execute(
      'INSERT INTO products (name, price, old_price, badge, rating, reviews, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        this.name,
        this.price,
        this.old_price,
        this.badge,
        this.rating,
        this.reviews,
        this.description,
        this.image,
      ]
    );
  }

  updateProduct() {
    return db.execute(
      'update products set name = ?,  price = ?,  old_price = ?,  badge = ?,  rating = ?,  reviews = ?,  description = ?,  image = ? where id = ?',
      [
        this.name,
        this.price,
        this.old_price,
        this.badge,
        this.rating,
        this.reviews,
        this.description,
        this.image,
        this.id,
      ]
    );
  }
}

module.exports = Product;
