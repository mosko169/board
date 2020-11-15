const log = require('./common/logger');
const crypto = require('crypto');

class BoardServer {
    constructor(boardsMgr, clientsMgr, lessonsMgr) {
        this.boardsMgr = boardsMgr;
        this.clientsMgr = clientsMgr;

        this.lessonsMgr = lessonsMgr;

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

    async startSession(boardId, sessionData) {
        let board = this.getBoard(boardId);
        let sessionId = BoardServer.generateSessionId();
        log.info("starting session " + sessionId + " in board " + boardId);
        this.sessions[sessionId] = boardId;
        let outputPath = board.setSession(sessionId, sessionData);
        await this.lessonsMgr.addLesson(sessionId, boardId, sessionData.courseId, sessionData.lessonName, outputPath);
    }

    async stopSession(sessionId) {
        let boardId = this.sessions[sessionId];
        await this.boards[boardId].stopSession();
        delete this.sessions[sessionId];
        await this.lessonsMgr.lessonFinished(sessionId);
        log.info("session " + sessionId + " in board " + boardId + " has stopped");
    }

    getSessionBoard(sessionId) {
        return this.getBoard(this.sessions[sessionId]);
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
        })

        boardsMgr.on('boardDisconnected', async boardId => {
            await this.removeBoard(boardId);
        });
    }

    async removeBoard(boardId) {
        Object.values(this.boardClients[boardId]).forEach(boundClient => {
            boundClient.boardDisconnected();
        })
        let boardCurrentSession = this.boards[boardId] && this.boards[boardId].sessionId;
        if (boardCurrentSession) {
            await this.stopSession(boardCurrentSession);
        }
        delete this.boards[boardId];
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
            let requestedBoard = this.getClientBoard(client);
            delete this.boardClients[requestedBoard.id][client.id];
            requestedBoard.removeClient(client.id);
        } catch (err) {
            log.error('failed to remove client ' + client.id + ' from board ' + this.sessions[client.sessionId] + ' error: ', err);
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
