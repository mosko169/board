
class Board {
    constructor(boardSocket, boardCanvas, id) {
        this.boardSocket = boardSocket;
        this.boardCanvas = boardCanvas;
        this._registerBoardEvents(boardSocket);
        this.id = id;
        this.clients = {};
    }

    async addClient(client) {
        this.clients[client.id] = client;
        client.sendCanvas(this.boardCanvas.getCanvas());
    }

    setSession(sessionId, sessionData) {
        this.sessionId = sessionId;
    }

    getCanvasProperties() {
        return this.boardCanvas.getCanvasProperties();
    }

    removeClient(clientId) {
        delete this.clients[clientId]
    }

    _registerBoardEvents(boardSocket) {
        boardSocket.on('drawing', (drawingData) => {
            this.boardCanvas.draw(drawingData);
            this._boradcast(drawingData);
          });
    }

    _boradcast(drawingData) {
        Object.values(this.clients).forEach(client => {
            client.sendDrawing(drawingData);
        })
    }

    terminate() {
        this.boardCanvas.terminate();
    }
}

module.exports = Board;
