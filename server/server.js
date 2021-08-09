const express = require('express');
const bodyParser = require('body-parser');
const socketio = require('socket.io');

const verifyToken = require('../configs/conf');

const API_VERSION = '/api/v1';
const PORT = process.env.PORT || 3050;


const app = express();
const router = express.Router();
app.use(bodyParser.json());


app.set('api_secret_key', verifyToken.api_secret_key);
app.use(API_VERSION, router);

// is login middleware
// router.use((req, res, next) => { });

// add user
require('../routers/add-user')(router);

app.get('/', (req, res) => {
    res.status(200).json({ server: 'running' });
});

const server = app.listen(PORT, () => console.log('Server running'));


// socket

const io = socketio(server);

io.on('connection', (socket) => {

});