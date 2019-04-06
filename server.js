const socketio = require('socket.io');
const express = require('express');
const EventEmitter = require('events');

const BoardServer = require('./board_server');
const Board = require('./board');
const Client = require('./client')

let clientsMgr = new EventEmitter();
let boardsMgr = new EventEmitter();

let boardServer = new BoardServer(boardsMgr, clientsMgr);

let s = socketio({
    path: '/socket.io',
  });

let clientsSocket = s.of('/clients');
let boardsSocket = s.of('/boards');

clientsSocket.on('connection', clientSocket => {
    let query = clientSocket.handshake.query;
    clientsMgr.emit('newClient', new Client(clientSocket, query.clientId, query.boardId));
})

boardsSocket.on('connection', boardSocket => {
    boardsMgr.emit('newBoard', new Board(boardSocket, boardSocket.handshake.query.boardId));
})

s.listen(3000);
