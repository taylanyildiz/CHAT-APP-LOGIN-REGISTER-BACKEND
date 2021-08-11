const express = require('express');
const socketio = require('socket.io');
const conf = require('../configs/conf');
const verify = require('../json-web-token/verify-token');

const API_VERSION = '/api/v1';
const PORT = process.env.PORT || 3050;


const app = express();
const router = express.Router();
app.use(express.json());


app.set('api_secret_key', conf.api_secret_key);
app.use(API_VERSION, router);

app.get('/', (req, res) => {
    res.status(200).json({ connection: 'succesfully' });
});

// create an account
require('../routers/create-account')(router);

// user login
require('../routers/login')(router);

// get unread messages
require('../routers/get-unread-message')(router);

// listen server
const server = app.listen(PORT, () => console.log('Server running : ' + PORT));

// socket
const io = socketio(server);

// socket jwt verify
io.use(verify.verifySocketToken);


io.on('connection', (socket) => {
    console.log('user connected');
});





