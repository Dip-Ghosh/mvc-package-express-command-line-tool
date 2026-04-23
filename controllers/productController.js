const Product = require('../models/product');

products = async (req, res) => {
  try {
    res.render('index', {
      title: 'Home',
      activePage: 'home',
      products: await Product.fetchProducts(),
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

create = (req, res) => {
  res.render('add-product', {
    title: 'Add New Product',
    activePage: 'add Product',
  });
};

save = async (req, res) => {
  try {
    const { name, price, oldPrice, badge, rating, reviews, description, image } = req.body;
    const product = new Product(
      null,
      name,
      parseFloat(price),
      parseFloat(oldPrice) || null,
      badge || null,
      parseInt(rating),
      parseInt(reviews),
      description || null,
      image || null
    );

    await product.saveProduct();
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

edit = async (req, res) => {
  try {
    const product = await Product.fetchProductById(parseInt(req.params.id));

    if (!product) return res.send('Product not found');

    res.render('edit-product', {
      title: 'Edit Product',
      activePage: 'Edit Product',
      product: product,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

update = async (req, res) => {
  try {
    const { name, price, oldPrice, badge, rating, reviews, description, image } = req.body;
    const id = parseInt(req.params.id);

    const product = new Product(
      id,
      name,
      parseFloat(price),
      parseFloat(oldPrice),
      badge,
      parseInt(rating),
      parseInt(reviews),
      description,
      image
    );

    await product.updateProduct();
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

destroy = async (req, res) => {
  try {
    await Product.deleteProduct(parseInt(req.params.id));
    return res.redirect('/');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { products, create, save, edit, destroy };
