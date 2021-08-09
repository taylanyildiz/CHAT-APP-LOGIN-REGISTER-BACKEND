const controller = require('../controllers/add-user-controller');
module.exports = (app) => {
    const field = '/user';
    app.post(field + '/add-user', controller.addUser);
}