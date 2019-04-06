
class Board {
    constructor(boardSocket, id) {
        this.boardSocket = boardSocket;
        this._registerBoardEvents(boardSocket);
        this.id = id;
        this.clients = {};
    }

    addClient(client) {
        this.clients[client.id] = client;
    }

    removeClient(clientId) {
        delete clients[clientId]
    }

    _registerBoardEvents(boardSocket) {
        boardSocket.on('drawing', (drawingData) => {
            this._boradcast(drawingData);
          });
    }

    _boradcast(drawingData) {
        Object.values(this.clients).forEach(client => {
            client.sendDrawing(drawingData);
        })
    }
}

module.exports = Board;
