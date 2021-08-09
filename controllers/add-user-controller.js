const db = require('../configs/db.conf');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var salt = bcrypt.genSaltSync(10);

const addUser = (req, res) => {
    console.log(req.body);
    const { name, phone, password } = req.body;
    const sql = 'INSERT INTO users (user_name,user_phone,user_password) VALUES (?,?,?);';
    bcrypt.hash(password, salt, function (err, hash) {
        db.query(sql, [name, phone, hash], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(400).json({ message: 'already have user' });
                    return;
                }
                res.status(400).json({ msg: err });
                return;
            }
            else {
                const payload = { name };
                const token = jwt.sign(payload, req.app.get('api_secret_key'));
                const sql = 'SELECT * FROM users WHERE user_phone = ?';
                db.query(sql, [phone], (err, result) => {
                    if (err) {
                        res.status(400).json({ msg: err });
                    } else {
                        bcrypt.compare(password, result[0].user_password, (err, match) => {
                            if (err) res.status(400).json({ match: match });
                            res.status(200).json({ user: result[0], token: token });
                        });
                    }
                });
                return;
            }
        });
    });
}

module.exports = { addUser };