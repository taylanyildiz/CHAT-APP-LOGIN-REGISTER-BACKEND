const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) => {
            if (err) {
                res.json({
                    status: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.decode = decoded;
                next();
            }
        });
    } else {
        res.status(200).json({
            status: false,
            message: 'No token provided'
        })
    }
}