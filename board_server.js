

class BoardServer {
    constructor(boardsMgr, clientsMgr) {
        this.boardsMgr = boardsMgr;
        this.clientsMgr = clientsMgr;

        this.boardClients = {};
        this.boards = {};
        this.clients = {};

        this._registerBoardsMgr(this.boardsMgr);
        this._registerClientsMgr(this.clientsMgr);
    }

    _registerBoardsMgr(boardsMgr) {
        boardsMgr.on('newBoard', board => {
            this.boards[board.id] = board;
            this.boardClients[board.id] = {};
        })
    }

    _registerClientsMgr(clientsMgr) {
        clientsMgr.on('newClient', client => {
            this.clients[client.id] = client;

            this._bindClientToBoard(client);
        })
    }

    _bindClientToBoard(client) {
        let boardId = client.getRequestedBoardId()
        let requestedBoard = this.getBoard(boardId);
        requestedBoard.addClient(client);
        this.boardClients[boardId][client.id] = client;
    }
}

module.exports = BoardServer;
