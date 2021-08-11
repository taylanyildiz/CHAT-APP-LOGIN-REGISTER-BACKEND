const db = require('../configs/db.conf');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = (req, res) => {
    const { name, password } = req.body;
    if (name && password) {
        const sql = 'SELECT * FROM users WHERE user_name = ?'
        db.query(sql, [name], (err, result) => {
            if (err) res.status(400).json({ message: 'Query Error' });
            if (result.length <= 0) res.status(401).json({ message: 'incorrect user name' });
            else {
                if (bcrypt.compareSync(password, result[0].user_password)) {
                    const payload = { name };
                    const token = jwt.sign(payload, 'api_secret_key', {
                        expiresIn: '1d' // 1 day
                    });
                    return res.status(200).json({ user: result, token: token });
                }
                return res.status(401).json({ message: 'Incorrect  password' });
            }
        });
    }

}

module.exports = { login };