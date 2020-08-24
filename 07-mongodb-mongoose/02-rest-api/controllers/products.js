const mongoose = require('mongoose');
const Product = require('../models/Product');

const mapProduct = product => ({
  id: product._id,
  title: product.title,
  description: product.description,
  price: product.price,
  category: product.category,
  subcategory: product.subcategory,
  images: product.images,
});

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  ctx.productSearchOptions = {};

  if (!ctx.query.subcategory) {
    return next();
  }

  if (!mongoose.Types.ObjectId.isValid(ctx.query.subcategory)) {
    ctx.status = 400;
    ctx.body = { message: 'invalid id' };
    return;
  }

  ctx.productSearchOptions.subcategory = ctx.query.subcategory;
  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find(ctx.productSearchOptions);

  if (!products) {
    ctx.body = { products: [] };
  } else {
    ctx.body = { products: products.map(mapProduct) };
  }
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.status = 400;
    ctx.body = { message: 'invalid id' };
    return;
  }

  const product = await Product.findById(ctx.params.id);

  if (!product) {
    ctx.status = 404;
    ctx.body = { message: 'not found' };
  } else {
    ctx.body = { product: mapProduct(product) };
  }
};

