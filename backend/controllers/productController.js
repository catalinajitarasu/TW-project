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
};

// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.setHeader('Content-Type', 'application/json');
//     res.statusCode = 200;
//     res.end(JSON.stringify(products));
//   } catch (error) {
//     console.log(error);
//     res.setHeader('Content-Type', 'application/json');
//     res.statusCode = 500;
//     res.end(JSON.stringify({ error: 'Internal Server Error' }));
//   }
// };

exports.getProducts = async (req, res) => {
  try {
    const name = req.query?.name; 
    console.log('Query param - name:', name); 

    let products;

    if (typeof name !== 'undefined') {
      console.log('Performing search by name...');
      products = await Product.find({ name: name });
    } else {
      console.log('Getting all products...');
      products = await Product.find();
    }

    console.log('Products:', products); 

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(products));
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};
