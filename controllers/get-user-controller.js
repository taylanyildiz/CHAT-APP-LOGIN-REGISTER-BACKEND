const db = require('../configs/db.conf');
const jwt = require('jsonwebtoken');
const getUser = (req, res) => {
    const { name, phone } = req.body;

    const sql = 'SELECT * FROM users WHERE user_name = ?';

    db.query(sql, [name], (err, response) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: err });
            return;
        } else if (!response[0]) {
            res.status(400).json({ message: 'Not found user' });
            return;
        } else {
            const payload = { name };
            const token = jwt.sign(payload, req.app.get('api_secret_key'));
            res.status(200).json({
                user: response[0],
                token: token,
            });
            return;
        }
    });
}

module.exports = { getUser };