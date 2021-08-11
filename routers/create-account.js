const controller = require('../controllers/create-account-controller');
module.exports = (app) => {
    const field = '/user';
    app.post(field + '/create-account', controller.createAccount);
}