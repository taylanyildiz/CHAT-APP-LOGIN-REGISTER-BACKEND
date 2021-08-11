const controller = require('../controllers/get-unread-messages-controller');
const verify = require('../json-web-token/verify-token');

module.exports = (app) => {
    const field = '/messages';
    app.post(field + '/get-unread-messages', verify.verifyRefreshToken, controller.getUnReadMessages);
}