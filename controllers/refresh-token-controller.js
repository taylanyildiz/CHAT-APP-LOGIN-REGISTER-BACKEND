const db = require('../configs/db.conf');
const jwt = require('jsonwebtoken');

const getRefreshToken = (req, res) => {
    const { name } = req.body;
    if (name) {
        const payload = { name };
        const refreshtToken = jwt.sign(payload, 'api_secret_key', {
            expiresIn: '1d' // 1 day 
        });
        return res.status(200).json({ refreshtToken: refreshtToken });
    } else {
        return res.status(401).json({ message: 'Not found User' });
    }
};

module.exports = { getRefreshToken }