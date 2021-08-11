const verify = require('../json-web-token/verify-token');

module.exports = (app) => {
    const field = '/take';
    app.post(field + '/new-token', verify.verifyRefreshToken, (req, res) => {
        res.status(200).json({ token: 'Valid Token' });
    });
}