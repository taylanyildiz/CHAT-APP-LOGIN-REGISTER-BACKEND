const express = require('express');
const bodyParser = require('body-parser');



const API_VERSION = '/api/v1';
const PORT = process.env.PORT || 3050;


const app = express();
const router = express.Router();
app.use(bodyParser.json());
app.use(API_VERSION, router);

require('../routers/add-user')(router);

app.get('/', (req, res) => {
    res.status(200).json({ server: 'running' });
});

const server = app.listen(PORT, () => console.log('Server running'));

const io = socketio(server);


io.on('connection', (socket) => { 
    console.log('user connection');
});