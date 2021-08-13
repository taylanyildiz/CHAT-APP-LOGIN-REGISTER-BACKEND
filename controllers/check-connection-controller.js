const db = require('../configs/db.conf');
const jwt = require('jsonwebtoken');

const checkAccount = (req, res) => {
    const { name, password } = req.body;
    if (name && password) {
        const sql = 'CALL GetCurrentUser(?,?)';
        db.query(sql, [name, password], (err, result) => {
            if (err) return res.status(400).json({ message: 'Query Error' });
            if (result[0].length <= 0) return res.status(400).json({ message: 'Not Found User' });
            else {
                const payload = { name };
                const token = jwt.sign(payload, 'api_secret_key', {
                    expiresIn: '1d',
                });
                return res.status(200).json({ user: result[0], token: token });
            }
        });
    } else return res.status(401).json({ message: 'Null User' });
}

module.exports = { checkAccount };