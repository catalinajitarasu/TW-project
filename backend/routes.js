const userController = require('./controllers/userController');
const productController = require('./controllers/productController');


module.exports = [
    // user
    { path: '/user', method: 'GET', controller: userController.getUser},
    { path: '/user/cart', method: 'GET', controller: userController.getUserCart},
    { path: '/user/favorites', method: 'GET', controller: userController.getUserFavorites},
    { path: '/login', method: 'POST', controller: userController.logIn },
    { path: '/sign-up', method: 'POST', controller: userController.signUp },
    { path: '/user/update', method: 'PATCH', controller: userController.updateUser },
    { path: '/user/cart/remove', method: 'DELETE', controller: userController.removeCartProduct},
    { path: '/user/cart/empty', method: 'DELETE', controller: userController.emptyCart},
    { path: '/user/favorites/remove', method: 'DELETE', controller: userController.removeFavoritesProduct},
    { path: '/user/favorites/empty', method: 'DELETE', controller: userController.emptyFavorites},

    // products
    { path: '/products', method: 'GET', controller: productController.getProducts },
    { path: '/products/by-type', method: 'GET', controller: productController.getProductsByType },
    { path: '/products/by-name', method: 'GET', controller: productController.getProductByName },
    { path: '/add-product', method: 'POST' , controller: productController.addProduct},
    { path: '/products/add-to-cart', method: 'POST', controller: productController.addToCart },
    { path: '/products/add-to-favorites', method: 'POST', controller: productController.addToFavorites },

    // others
    { path: '/downloadAllProducts-csv', method: 'GET', controller: productController.generateProductCSV },
    { path: '/downloadAllProducts-pdf', method: 'GET', controller: productController.generateProductPDF },
];
