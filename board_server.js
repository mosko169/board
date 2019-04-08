const log = require('./common/logger');

class BoardServer {
    constructor(boardsMgr, clientsMgr) {
        this.boardsMgr = boardsMgr;
        this.clientsMgr = clientsMgr;

        this.boardClients = {};
        this.clientBoards = {};
        this.boards = {};
        this.clients = {};

        this._registerBoardsMgr(this.boardsMgr);
        this._registerClientsMgr(this.clientsMgr);
    }

    getBoard(boardId) {
        let board = this.boards[boardId];
        if (!board) {
            throw new Error("invalid board id ", boardId);
        }
        return board;
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

        boardsMgr.on('boardDisconnected', boardId => {
            this.removeBoard(boardId);
        });
    }

    removeBoard(boardId) {
        Object.values(this.boardClients[boardId]).forEach(boundClient => {
            boundClient.boardDisconnected();
        })
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
        let boardId = client.getRequestedBoardId()
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
        try {
            log.info('binding client ' + client.id + ' to board ' + client.getRequestedBoardId());
            let requestedBoard = this.getClientBoard(client);
            requestedBoard.addClient(client);
            this.boardClients[requestedBoard.id][client.id] = client;
        } catch (err) {
            log.error('failed to bind client ' + client.id + ' to board ' + client.getRequestedBoardId() + ' error: ', err);
        }
    }
}

module.exports = BoardServer;
