const Product = require('../models/productModel');
const User = require('../models/userModel');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const PDFDocument = require('pdfkit');
const querystring = require('querystring');
const url = require('url');

exports.generateProductCSV = async (req, res) => {
  try {
    const products = await Product.find();
    console.log('Produse găsite:', products);

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

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="product_report.csv"');

    const fileStream = fs.createReadStream('product_report.csv');
    fileStream.pipe(res);

    fileStream.on('end', () => {
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

exports.addToCart = async (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
      body +=chunk.toString();
    });
    req.on('end', async () => {
      const data = JSON.parse(body);
      try {
        console.log("add to cart")
        const product = await Product.findById(data.productId);
        if(product === undefined || product === null){
          res.statusCode=404
          res.statusMessage="Product not found!"
          res.end()
          return
        }
        let user = await User.find({email: data.userEmail});
        if(user === undefined || user === null){
          res.statusCode=404
          res.statusMessage="User not found!"
          res.end()
          return
        }
        console.log(user)
        user = user[0]
        user.cart.push(product._id)
        console.log(2)

        const response = await user.save()
        console.log(`response ${response}`)
        res.status=201;
        res.end(JSON.stringify(response));
      } catch (error) {
        console.log(error)
        res.statusCode = 500;
        res.end(JSON.stringify(error));
      }
  });
};

exports.addToFavorites = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body +=chunk.toString();
  });
  req.on('end', async () => {
    const data = JSON.parse(body);
    try {
      console.log("add to favorites")
      const product = await Product.findById(data.productId);
      if(product === undefined || product === null){
        res.statusCode=404
        res.statusMessage="Product not found!"
        res.end()
        return
      }
      let user = await User.find({email: data.userEmail});
      if(user === undefined || user === null){
        res.statusCode=404
        res.statusMessage="User not found!"
        res.end()
        return
      }
      console.log(user)
      user = user[0]
      user.favorites.push(product._id)
      console.log(2)

      const response = await user.save()
      console.log(`response ${response}`)
      res.status=201;
      res.end(JSON.stringify(response));
    } catch (error) {
      console.log(error)
      res.statusCode = 500;
      res.end(JSON.stringify(error));
    }
});
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
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
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);
    const type = queryParams.type; 
    console.log('Query param - type:', queryParams.type);
    const products = await Product.find({ type: type }); 
    console.log('Products filtered by type:', products);

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
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);
    const name = queryParams.name; 
    console.log('Query param - name:', queryParams.name);

    const products = await Product.find({ name: name }); 
    console.log('Products filtered by name:', products);

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


exports.generateProductPDF = async (req, res) => {
  try {
    const products = await Product.find();
    console.log('Produse găsite:', products);

    const pdf = new PDFDocument();
    pdf.pipe(fs.createWriteStream('product_report.pdf'));

    pdf.fontSize(18).text('Raport produse', { align: 'center' });
    pdf.moveDown();

    products.forEach((product) => {
      pdf.fontSize(12).text(`Nume: ${product.name}`);
      pdf.fontSize(10).text(`Descriere: ${product.description}`);
      pdf.fontSize(10).text(`Preț: ${product.price}`);
      pdf.fontSize(10).text(`Tip: ${product.type}`);
      pdf.moveDown();
    });

    pdf.end();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="product_report.pdf"');

    const fileStream = fs.createReadStream('product_report.pdf');
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlink('product_report.pdf', (err) => {
        if (err) {
          console.error('Eroare la ștergerea fișierului PDF:', err);
        } else {
          console.log('Fișierul PDF a fost șters cu succes.');
        }
      });
    });

    fileStream.on('error', (error) => {
      console.error('Eroare la trimiterea fișierului PDF:', error);
    });
  } catch (error) {
    console.error('Eroare la generarea fișierului PDF:', error);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};


exports.generateUserFavoritesPDF = async (req, res) => {
    try {
      const parsedUrl = url.parse(req.url);
      const queryParams = querystring.parse(parsedUrl.query)
      console.log('User email:', queryParams.userEmail);
      let user = await User.findOne({ email: queryParams.userEmail });

      if (!user) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Utilizatorul nu a fost găsit.' }));
        return;
      }

      const favoriteProducts = await Product.find({ _id: { $in: user.favorites } });

      console.log('Favorite products:', favoriteProducts);

      const pdf = new PDFDocument();
      const pdfStream = fs.createWriteStream('user_favorites.pdf');
      pdf.pipe(pdfStream);

      pdf.fontSize(18).text('Raport produse favorite', { align: 'center' });
      pdf.moveDown();

      favoriteProducts.forEach((product) => {
        pdf.fontSize(12).text(`Nume: ${product.name}`);
        pdf.fontSize(10).text(`Descriere: ${product.description}`);
        pdf.fontSize(10).text(`Preț: ${product.price}`);
        pdf.fontSize(10).text(`Tip: ${product.type}`);
        pdf.moveDown();
      });

      pdf.end();

      pdfStream.on('finish', () => {
        res.setHeader('Content-Type', 'application/pdf');
        fs.createReadStream('user_favorites.pdf').pipe(res);
      });
    } catch (error) {
      console.log(error);
      res.statusCode = 500;
      res.end();
    }
};


exports.generateUserFavoritesCSV = async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query)
    console.log('User email:', queryParams.userEmail);
    let user = await User.findOne({ email: queryParams.userEmail });

    if (!user) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Utilizatorul nu a fost găsit.' }));
      return;
    }

    const favoriteProducts = await Product.find({ _id: { $in: user.favorites } });

    console.log('Favorite products:', favoriteProducts);

    const csvWriter = createCsvWriter({
      path: 'user_favorites.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'description', title: 'Description' },
        { id: 'price', title: 'Price' },
        { id: 'type', title: 'Type' },
      ],
    });

    await csvWriter.writeRecords(favoriteProducts);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="user_favorites.csv"');

    const fileStream = fs.createReadStream('user_favorites.csv');
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlink('user_favorites.csv', (err) => {
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

