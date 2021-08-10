const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const verifyToken = require('../configs/conf');
const verify = require('../json-web-token/verify-token');

const API_VERSION = '/api/v1';
const PORT = process.env.PORT || 3050;


const app = express();
const router = express.Router();
app.use(bodyParser.json());


app.set('api_secret_key', verifyToken.api_secret_key);
app.use(API_VERSION, router);

app.get('/', (req, res) => {
    res.status(200).json({ connection: 'succesfully' });
});

// add user
require('../routers/add-user')(router);

const server = app.listen(PORT, () => console.log('Server running : ' + PORT));

// socket

const io = socketio(server);

// io.set(process.env.ACCESS_TOKEN_SECRET);

io.use(verify.jwtSocketIo);


io.on('connection', (socket) => { 
    console.log('user connected');
});





