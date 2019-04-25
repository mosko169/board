const socketio = require('socket.io');
const express = require('express');
const EventEmitter = require('events');

const BoardServer = require('./board_server');
const Board = require('./board/board');
const BoardCanvas = require('./board/board_canvas');
const Client = require('./client')
const log = require('./common/logger');

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
    let clientId = query.clientId;
    log.info('client ' + clientId + ' connected from ' + clientSocket.handshake.address);

    clientSocket.on('disconnect', () => {
        log.info('client ' + clientId + ' disconnected');
        clientsMgr.emit('clientDisconnected', clientId)
    });

    clientsMgr.emit('newClient', new Client(clientSocket, clientId, query.sessionId));
})

boardsSocket.on('connection', async boardSocket => {
    let boardId = boardSocket.handshake.query.boardId;
    let boardCanvas = new BoardCanvas();
    await boardCanvas.init();
    log.info('board ' + boardId + ' connected from ' + boardSocket.handshake.address);

    boardSocket.on('disconnect', () => {
        log.info('board ' + boardId +' disconnected');
        boardsMgr.emit('boardDisconnected', boardId);
    })
    
    boardsMgr.emit('newBoard', new Board(boardSocket, boardCanvas, boardId));
})

function validateClient(clientId) {
    return true;
}

s.listen(4000);

const app = express()

app.use('/static', express.static('build/static'))
app.use('/', express.static('build'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
    let userId = req.body.userId;
    let boardId = req.body.boardId;
    let board = boardServer.getBoard(boardId);
    res.send({
        sessionId: board.sessionId,
        canvasProperties: board.getCanvasProperties()
    });
});

//app.get('/', (req, res) => res.sendFile(__dirname + '/build/index.html'));

log.info("starting server");
app.listen(8080);