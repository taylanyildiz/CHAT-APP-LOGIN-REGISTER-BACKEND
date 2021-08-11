const controller = require('../controllers/login-controller');

module.exports = (app) => {
    const field = '/user';
    app.post(field + '/login', controller.login);
}