
class Board {
    constructor(boardSocket, boardCanvas, recorderProvider, id) {
        this.boardSocket = boardSocket;
        this.boardCanvas = boardCanvas;
        this.recorderProvider = recorderProvider;

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
        this.recorder = this.recorderProvider.getRecorder(sessionId, this.boardCanvas);
        this.recorder.start();
    }

    async stop() {
        if (this.recorder) {
            return this.recorder.stop();
        }
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
}

module.exports = Board;
