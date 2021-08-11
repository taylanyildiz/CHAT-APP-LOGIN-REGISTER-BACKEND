const db = require('../configs/db.conf');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var salt = bcrypt.genSaltSync(10);

const login = (req, res) => {
    const { name, password } = req.body;

    const sql = 'SELECT * FROM users WHERE user_name = ? AND user_pasword = ?';

    db.query(sql, [name, password], (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: err });
            return;
        } else if (!result[0]) {
            res.status(400).json({ message: 'Not found user' });
            return;
        } else {

            bcrypt.compare(password, result[0].user_password, (err, match) => {
                if (err) return res.status(400).json({ match: match });
                if (match === true) {
                    const payload = { name };
                    const token = jwt.sign(payload, 'api_secret_key', {
                        expiresIn: '1d' // 1 day
                    });
                    res.status(200).json({ user: result[0], token: token, match: match });
                } else {
                    return res.status(401).json({ match: match });
                }
            });



        }
    });
}

module.exports = { login };