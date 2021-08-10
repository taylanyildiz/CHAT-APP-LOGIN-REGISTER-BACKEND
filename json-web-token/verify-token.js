const jwt = require('jsonwebtoken');
const conf = require('../configs/conf');
const jwtHttp = (req, res, next) => {
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
        });
    }
}


const jwtSocketIo = (socket, next) => {
    const token = socket.handshake.headers['socket-token'];
    console.log(token);
    if (!token) {
        new Error('No token provided');
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) next();
            else new Error('Authentication Error');
        });
    }
}


module.exports = {
    jwtHttp,
    jwtSocketIo,
};