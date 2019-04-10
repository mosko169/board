const log = require('./common/logger');
const crypto = require('crypto');

class BoardServer {
    constructor(boardsMgr, clientsMgr) {
        this.boardsMgr = boardsMgr;
        this.clientsMgr = clientsMgr;

        this.boardClients = {};
        this.sessions = {};
        this.boards = {};
        this.clients = {};

        this._registerBoardsMgr(this.boardsMgr);
        this._registerClientsMgr(this.clientsMgr);
    }

    static generateSessionId() {
        let sha = crypto.createHash('sha256');
        sha.update(Math.random().toString());
        return sha.digest('hex');
    } 

    getBoard(boardId) {
        let board = this.boards[boardId];
        if (!board) {
            throw new Error("invalid board id ", boardId);
        }
        return board;
    }

    startSession(boardId, sessionData) {
        let board = this.getBoard(boardId);
        let sessionId = BoardServer.generateSessionId();
        this.sessions[sessionId] = boardId;
        board.setSession(sessionId, sessionData); 
    }

    getBoardSession(boardId) {
        return this.getBoard(boardId).sessionId;
    }

    addClient(client) {
        this.clients[client.id] = client;
        return this._bindClientToBoard(client);
    }

    removeClient(clientId) {
        let deletedClient = this.clients[clientId];
        delete this.clients[clientId];
        return this._removeClientFromBoard(deletedClient);
    }

    _registerBoardsMgr(boardsMgr) {
        boardsMgr.on('newBoard', board => {
            this.boards[board.id] = board;
            this.boardClients[board.id] = {};
            this.startSession(board.id);
        })

        boardsMgr.on('boardDisconnected', boardId => {
            this.removeBoard(boardId);
        });
    }

    removeBoard(boardId) {
        Object.values(this.boardClients[boardId]).forEach(boundClient => {
            boundClient.boardDisconnected();
        })
        let boardCurrentSession = this.boards[boardId] && this.boards[boardId].sessionId;
        delete this.boards[boardId];
        delete this.sessions[boardCurrentSession];
    }

    _registerClientsMgr(clientsMgr) {
        clientsMgr.on('newClient', client => {
            this.addClient(client);
        })

        clientsMgr.on('clientDisconnected', clientId => {
            this.removeClient(clientId);
        });
    }

    getClientBoard(client) {
        let boardId = this.sessions[client.sessionId];
        return this.getBoard(boardId);
    }

    _removeClientFromBoard(client) {
        try {
            delete this.boardClients[requestedBoard.id][client.id];
            let requestedBoard = this.getClientBoard(client);
            requestedBoard.removeClient(client.id);
        } catch (err) {
            log.error('failed to remove client ' + client.id + ' from board ' + client.getRequestedBoardId() + ' error: ', err);
        }
    }

    _bindClientToBoard(client) {
        let requestedBoardId = this.sessions[client.sessionId];
        if (!requestedBoardId) {
            log.warn('attempted to bind client ' + client.id + ' to invalid session ' + client.sessionId)
            return;
        }

        try {
            log.info('binding client ' + client.id + ' to board ' + requestedBoardId);
            let requestedBoard = this.getClientBoard(client);
            requestedBoard.addClient(client);
            this.boardClients[requestedBoard.id][client.id] = client;
        } catch (err) {
            log.error('failed to bind client ' + client.id + ' to board ' + requestedBoardId + ' error: ', err);
        }
    }
}

module.exports = BoardServer;
