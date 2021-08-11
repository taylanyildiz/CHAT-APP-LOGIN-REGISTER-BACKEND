const controller = require('../controllers/account-controller');
module.exports = (app) => {
    const field = '/user';
    app.post(field + '/create-account', controller.createAccount);
}