const verify = require('../json-web-token/verify-token');

module.exports = (app) => {
    const field = '/client'
    app.get(field+'/socket-user', verify, (req, res) => {
        res.status(200).json({ server: "running with api" });
    });
}