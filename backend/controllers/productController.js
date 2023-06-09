const Product = require('../models/productModel');

exports.addProduct = async (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
      body +=chunk.toString();
    });
    req.on('end', async () => {
    const data = JSON.parse(body);
  try {

    const newProduct = new Product(data);
    console.log(newProduct);
    const savedProduct = await newProduct.save();
    console.log(`response ${savedProduct}`)
    res.status=201;
    res.end(JSON.stringify(savedProduct));
  } catch (error) {
    console.log(error)
    res.statusCode = 500;
    res.end(JSON.stringify(error));
  }
});
}
