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

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query.query;

  if (
    typeof query === 'string'
    && !query
    && !query.trim()
  ) {
    ctx.body = { products: [] };
  }

  const products = await Product.find({ $text: { $search: query } })

  if (!products) {
    ctx.body = { products: [] };
  } else {
    ctx.body = { products: products.map(mapProduct) };
  }
};
