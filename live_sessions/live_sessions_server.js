const EvenEmitter = require('events');

const RecorderPovider = require('./board/record/recorder_provider');
const BoardServer = require('./board_server');
const Board = require('./board/board');
const BoardCanvas = require('./board/board_canvas');
const Client = require('./client')
const log = require('../common/logger');

const RECORDS_PATH = path.join(process.cwd(), "records");


class LiveSessionsServer {
    constructor(liveSessionsSocket, dbConn) {
        this.liveSessionsSocket = liveSessionsSocket;
        this.dbConn = dbConn;
    }
    
    initialize() {
        if (!fs.existsSync(RECORDS_PATH)) {
            fs.mkdirSync(RECORDS_PATH);
        }

        this.recorderPovider = new RecorderPovider(RECORDS_PATH);
        let clientsMgr = new EvenEmitter();
        let boardsMgr = new EvenEmitter();
        this.BoardServer = new BoardServer(clientsMgr, boardsMgr);

        clientsSocket = this.liveSessionsSocket.of('/clients');
        _registerClientsSocket(clientSocket, clientsMgr);
        
        boardsSocket = this.liveSessionsSocket.of('/boards');
        _registerBoardsSocket(boardsSocket);
    }
    
    _registerClientsSocket(clientsSocket, clientsMgr) {
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
    }
    
    _registerBoardsSocket(boardsSocket, boardsMgr) {
        boardsSocket.on('connection', boardSocket => {
            let boardId = boardSocket.handshake.query.boardId;
            let boardCanvas = new BoardCanvas();
            log.info('board ' + boardId + ' connected from ' + boardSocket.handshake.address);
            
            boardSocket.on('disconnect', () => {
                log.info('board ' + boardId +' disconnected');
                boardsMgr.emit('boardDisconnected', boardId);
            })
            
            boardsMgr.emit('newBoard', new Board(boardSocket, boardCanvas, this.recorderPovider, boardId));
        })
    }
}

module.exports = LiveSessionsServer;
