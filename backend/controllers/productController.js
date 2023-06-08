const Product = require('../models/productModel');

exports.addProduct = async (req, res) => {
  try {
    const { photo, name, description, price, mentions } = req.body;

    const newProduct = new Product({
      photo,
      name,
      description,
      price,
      mentions
    });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
