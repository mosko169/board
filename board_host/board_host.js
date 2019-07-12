const SerialBoard = require('./serial_board');
const SocketIO = require('socket.io-client');

let socket = SocketIO('http://localhost:4000/boards?boardId=1');
let board = new SerialBoard('/COM5');

board.on('drawing', (data) => {
    socket.emit('drawing', data);
});
