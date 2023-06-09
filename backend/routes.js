const userController = require('./controllers/userController');
const productController = require('./controllers/productController');


module.exports = [
    { path: '/login', method: 'POST', controller: userController.logIn },
    { path: '/sign-up', method: 'POST', controller: userController.signUp },
    { path: '/add-product', method: 'POST' , controller: productController.addProduct},
    { path: '/products', method: 'GET', controller: productController.getProducts },
];
