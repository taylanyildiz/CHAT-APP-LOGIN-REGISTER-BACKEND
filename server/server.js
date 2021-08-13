const express = require('express');
const socketio = require('socket.io');
const conf = require('../configs/conf');
const verify = require('../json-web-token/verify-token');

const API_VERSION = '/api/v1';
const PORT = process.env.PORT || 3050;


const app = express();
const router = express.Router();
app.use(express.json());



// token key 
app.set('api_secret_key', conf.api_secret_key);

// router 
app.use(API_VERSION, router);

router.use((req, res, next) => {
    // middleware 
    next();
})


app.get('/', (req, res) => {
    res.status(200).json({ connection: 'succesfully' });
});

// create an account
require('../routers/create-account')(router);

// user login
require('../routers/login')(router);

// get unread messages for test 
require('../routers/refresh-token')(router);

// check user account 
require('../routers/check-connection')(router);

// listen server
const server = app.listen(PORT, () => console.log('Server running : ' + PORT));

// socket
const io = socketio(server);

// socket jwt verify
io.use(verify.verifySocketToken);

let clients = [];

io.on('connection', (socket) => {
    // listen user connect
    socket.on('user connected', user => {
        let { user_phone, user_name, isOnline } = user;
        isOnline = true;
        console.log(user_name + ' Connected');

        socket.userID = user_phone;
        socket.username = user_name;

        socket.join(socket.userID);

        let index = clients.findIndex(client => client.user_phone == user_phone);
        if (index == -1) {
            clients.push(user);
        } else {
            clients[index] = user;
        }
        socket.emit('get user', clients); // all user get
        socket.broadcast.emit('user connected', user); // new user get
    });


    socket.on('typing', data => {
        // to => who is typing
        socket.to(data['receiver_phone']).to(socket.userID).emit('typing',data);
    });




    socket.on('private message', data => {
        // from ----message--> to
        const { sender, receiver } = data;
        console.log(sender.user_name + ' send message to ' + receiver.user_name);
        socket.to(receiver.user_phone).to(socket.userID).emit('private message', data);
    });




    // user disconnect offline
    socket.on('disconnect', () => {
        let index = clients.findIndex(element => element.user_phone === socket.userId);
        console.log(clients[index].user_name + ' user is offline');
        clients[index].isOnline = false;
        socket.broadcast.emit('user offline', clients[index]);
    });
});





