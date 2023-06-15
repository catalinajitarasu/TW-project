const userController = require('./controllers/userController');
const productController = require('./controllers/productController');


module.exports = [
    // user
    { path: '/user/cart', method: 'GET', controller: userController.getUserCart},
    { path: '/login', method: 'POST', controller: userController.logIn },
    { path: '/sign-up', method: 'POST', controller: userController.signUp },
    { path: '/user/update', method: 'PATCH', controller: userController.updateUser },
    { path: '/user/cart/remove', method: 'DELETE', controller: userController.removeCartProduct},
    { path: '/user/cart/empty', method: 'DELETE', controller: userController.emptyCart},

    // products
    { path: '/products', method: 'GET', controller: productController.getProducts },
    { path: '/products/by-type', method: 'GET', controller: productController.getProductsByType },
    { path: '/products/by-name', method: 'GET', controller: productController.getProductByName },
    { path: '/add-product', method: 'POST' , controller: productController.addProduct},
    { path: '/products/add-to-cart', method: 'POST', controller: productController.addToCart },

    // others
    { path: '/downloadAllProducts-csv', method: 'GET', controller: productController.generateProductCSV },
    { path: '/downloadAllProducts-pdf', method: 'GET', controller: productController.generateProductPDF },
];
