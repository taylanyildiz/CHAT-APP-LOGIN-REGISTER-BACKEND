const db = require('../configs/db.conf');

const addUser = (req, res) => {
    console.log(req.body);
    const { name, phone, password } = req.body;
    const sql = 'INSERT INTO users (user_name,user_phone,user_password) VALUES (?,?,?);';
    db.query(sql, [name, phone, password], (err, response) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.status(200).json({ message: 'already have user' });
            }
            return;
        }
        else {
            res.status(200).json({ user: 'user added' });
        }
    });
}

module.exports = { addUser };