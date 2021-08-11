const db = require('../configs/db.conf');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var salt = bcrypt.genSaltSync(10);

const createAccount = (req, res) => {
    console.log(req.body);
    const { name, phone, password } = req.body;
    const sql = 'INSERT INTO users (user_name,user_phone,user_password) VALUES (?,?,?);';
    bcrypt.hash(password, salt, function (err, hash) {
        db.query(sql, [name, phone, hash], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ message: 'already have user', err: err });
                }
                return res.status(400).json({ msg: err });
            }
            else {
                const payload = { name };
                const token = jwt.sign(payload, 'api_secret_key', {
                    expiresIn: '15s' // 15 seconds for test
                });
                const sql = 'SELECT * FROM users WHERE user_name = ?'
                db.query(sql, [name], (err, result) => {
                    if (err) {
                        return res.status(400).json({ msg: err });
                    } else {
                        bcrypt.compare(password, result[0].user_password, (err, match) => {
                            if (err) return res.status(400).json({ match: match });
                            if (match === true) {
                                return res.status(200).json({ user: result[0], token: token });
                            } else {
                                return res.status(200).json({ match: match });
                            }
                        });
                    }
                });
            }
        });
    });
}

module.exports = { createAccount };