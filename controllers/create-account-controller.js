const db = require('../configs/db.conf');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


var salt = bcrypt.genSaltSync(5, 'secret_key');

const createAccount = (req, res) => {
    console.log(req.body);
    const { name, phone, password } = req.body;
    const sql = 'INSERT INTO users (user_name,user_phone,user_password) VALUES (?,?,?);';
    bcrypt.hash(password, salt, function (err, hash) {
        if (err) return res.status(400).json({ message: err });
        db.query(sql, [name, phone, hash], (err, result) => {
            if (err) {
                return res.status(400).json({ message: 'error user create' });
            }
            else {
                const payload = { name };
                const token = jwt.sign(payload, 'api_secret_key', {
                    expiresIn: '1d' // 1 day 
                });
                const sql = 'CALL GetCurrentUser(?,?)';
                db.query(sql, [name, hash], (err, result) => {
                    if (err) {
                        return res.status(400).json({ message: 'Query Error' });
                    } else {
                        return res.status(200).json({ user: result[0], token: token });
                    }
                });
            }
        });
    });
}



module.exports = { createAccount };