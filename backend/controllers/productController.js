const Product = require('../models/productModel');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.generateProductCSV = async (req, res) => {
  try {
    const products = await Product.find();
    console.log('Produse găsite:', products);

    // Generare fișier CSV
    const csvWriter = createCsvWriter({
      path: 'product_report.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'description', title: 'Description' },
        { id: 'price', title: 'Price' },
        { id: 'type', title: 'Type' },
      ],
    });

    await csvWriter.writeRecords(products);

    // Descărcare fișier CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="product_report.csv"');

    const fileStream = fs.createReadStream('product_report.csv');
    fileStream.pipe(res);

    fileStream.on('end', () => {
      // Șterge fișierul după ce a fost trimis cu succes
      fs.unlink('product_report.csv', (err) => {
        if (err) {
          console.error('Eroare la ștergerea fișierului CSV:', err);
        } else {
          console.log('Fișierul CSV a fost șters cu succes.');
        }
      });
    });

    fileStream.on('error', (error) => {
      console.error('Eroare la trimiterea fișierului CSV:', error);
    });
  } catch (error) {
    console.error('Eroare la generarea fișierului CSV:', error);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};


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



exports.getProductByName = async (req, res) => {
  try {
    const name = req.query?.name; // Obține parametrul de query string "name"
    console.log('Query param - name:', name); // Adaugă acest console.log

    if (!name) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Numele produsului lipsește în cererea de căutare.' }));
      return;
    }

    const product = await Product.findOne({ name: name });

    if (product) {
      console.log('Product found:', product); // Adaugă acest console.log
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(product));
    } else {
      console.log('Product not found.'); // Adaugă acest console.log
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Produsul nu a fost găsit.' }));
    }
  } catch (error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};
