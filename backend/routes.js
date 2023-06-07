const userController = require('./controllers/userController');

module.exports = [
    { path: '/login', method: 'POST', controller: userController.logIn },
    { path: '/sign-up', method: 'POST', controller: userController.signUp },
];
