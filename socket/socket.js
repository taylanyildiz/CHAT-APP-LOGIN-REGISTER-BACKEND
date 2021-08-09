const socketio = require('socket.io');


const listenSocket = (server) => {
    const io = socketio(server);
}

module.exports = { listenSocket };