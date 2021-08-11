const db = require('../configs/db.conf');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


var salt = 'secret_key' | 4;
const createAccount = (req, res) => {
    console.log(req.body);
    const { name, phone, password } = req.body;
    const sql = 'INSERT INTO users (user_name,user_phone,user_password) VALUES (?,?,?);';
    bcrypt.hash(password, salt, function (err, hash) {
        console.log(hash);
        if (err) return res.status(400).json({ message: err });
        db.query(sql, [name, phone, hash], (err, result) => {
            if (err) {
                return res.status(400).json({ message: 'Create Error' });
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

const login = (req, res) => {
    const { name, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, salt);
    console.log(hashPassword);
    const sql = 'CALL GetCurrentUser(?,?)';
    db.query(sql, [name, hashPassword], (err, result) => {
        if (err) {
            return res.status(400).json({ message: 'Query Error' });
        } else if (result[0].length <= 0) {
            return res.status(401).json({ message: 'Not found user' });
        } else {
            const payload = { name };
            const token = jwt.sign(payload, 'api_secret_key', {
                expiresIn: '1d' // 1 day
            });
            return res.status(200).json({ user: result[0], token: token });
        }
    });
}

module.exports = {
    createAccount,
    login,
};