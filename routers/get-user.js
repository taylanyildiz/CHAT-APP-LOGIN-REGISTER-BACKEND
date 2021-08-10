const controller = require('../controllers/get-user-controller');

module.exports = (app) => {
    const field = '/get';
    app.post(field + '/get-user', controller.getUser);
}