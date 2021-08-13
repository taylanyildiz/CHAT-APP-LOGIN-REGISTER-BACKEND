const verify = require('../json-web-token/verify-token');
const controller = require('../controllers/refresh-token-controller');

module.exports = (app) => {
    const field = '/take';
    app.post(field + '/new-token', verify.verifyRefreshToken, controller.getRefreshToken);
}