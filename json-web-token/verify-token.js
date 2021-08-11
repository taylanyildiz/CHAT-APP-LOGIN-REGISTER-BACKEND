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
        const { name } = req.body;
        console.log(name);
        jwt.verify(token, 'api_secret_key', (err, decoded) => {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    const payload = { name };
                    const refreshtToken = jwt.sign(payload, 'api_secret_key', {
                        expiresIn: '15s'
                    });
                    return  res.status(200).json({ refreshtToken: refreshtToken });

                } else {
                    return res.status(401).json({ message: 'Failed to authenticate token' });
                }
            }else{
                next();
            }
        });
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
}


const verifySocketToken = (socket, next) => {
    const token = socket.handshake.headers['x-access-token'];
    console.log(token);
    if (!token) {
        return new Error('No token provided');
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) next();
            else return new Error('Authentication Error');
        });
    }
}



module.exports = {
    verifyToken,
    verifyRefreshToken,
    verifySocketToken,
};