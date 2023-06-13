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


exports.getProductsByType = async (req, res) => {
  try {
    const type = req.query?.type; // Obține parametrul de query string "type"
    console.log('Query param - type:', type); // Adaugă acest console.log

    const products = await Product.find({ type: type }); // Filtrare după tip

    console.log('Products filtered by type:', products); // Adaugă acest console.log

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


const path = require('path');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.generateProductReport = async (req, res) => {
  try {
    const products = await Product.find();

    // Generare fișier CSV
    const filePath = path.join(__dirname, '../reports/product_report.csv');
    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'name', title: 'Name' },
        { id: 'description', title: 'Description' },
        { id: 'price', title: 'Price' },
        { id: 'type', title: 'Type' },
      ],
    });

    await csvWriter.writeRecords(products);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="product_report.csv"');

    res.download(filePath, 'product_report.csv', (error) => {
      if (error) {
        console.error('Eroare la trimiterea fișierului CSV:', error);
      } else {
        console.log('Fișierul CSV a fost trimis cu succes.');
      }
    });
  } catch (error) {
    console.error('Eroare la generarea fișierului CSV:', error);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

