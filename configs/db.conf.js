const db = require('mysql');
const conf = require('./conf');

const { user, password, host, port, dbname } = conf.db;

const dbConnect = db.createConnection({
    user: user,
    password: password,
    host: host,
    port: port,
    database: dbname,
});


dbConnect.connect((err) => {
    if (err) throw err;
    console.log('DATABASE CONNECTED');
});

module.exports = dbConnect;