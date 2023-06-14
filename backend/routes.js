const userController = require('./controllers/userController');
const productController = require('./controllers/productController');


module.exports = [
    // user
    { path: '/login', method: 'POST', controller: userController.logIn },
    { path: '/sign-up', method: 'POST', controller: userController.signUp },
    { path: '/update', method: 'PATCH', controller: userController.updateUser },

    // products
    { path: '/add-product', method: 'POST' , controller: productController.addProduct},
    { path: '/products', method: 'GET', controller: productController.getProducts },
    { path: '/products/by-type', method: 'GET', controller: productController.getProductsByType },
    { path: '/products/by-name', method: 'GET', controller: productController.getProductByName },

    // others
    { path: '/download-csv', method: 'GET', controller: productController.generateProductCSV },
    { path: '/download-pdf', method: 'GET', controller: productController.generateProductPDF },
];
