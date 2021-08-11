const db = require('../configs/db.conf');

const getUnReadMessages = (req, res) => {
    // const sql = '';
    // db.query(sql, [], (err, response) => { });

    res.status(200).json({ status: 'success' });
}



module.exports = { getUnReadMessages };