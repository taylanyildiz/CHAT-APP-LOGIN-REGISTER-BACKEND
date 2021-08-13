const jwt = require('jsonwebtoken');
const conf = require('../configs/conf');

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, 'api_secret_key', (err, decoded) => {
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


const verifyRefreshToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'api_secret_key', (err, decoded) => {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    next();
                } else {
                    return res.status(401).json({ message: 'Failed to authenticate token' });
                }
            } else {
                next();
            }
        });
    } else {
        // token is available 
        return res.status(401).json({ message: 'No token provided' });
    }
}


const verifySocketToken = (socket, next) => {
    const token = socket.handshake.headers['x-access-token'];
    if (!token) {
        return console.log('No token provided');
    } else {
        jwt.verify(token, 'api_secret_key', (err, decoded) => {
            if (!err) next();
            else return console.log('Authentication Error');
        });
    }
}



module.exports = {
    verifyToken,
    verifyRefreshToken,
    verifySocketToken,
};