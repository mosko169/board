

class Client {
    constructor(clientSocket, id, boardId) {
        this.clientSocket = clientSocket;
        this.requestedBoarId = boardId;
        this.id = id;
    }

    getRequestedBoardId() {
        return this.requestedBoarId;
    }

    boardDisconnected() {
        this.clientSocket.emit('boardDisconnected');
    }

    sendCanvas(canvasBuff) {
        this.clientSocket.emit('canvas', canvasBuff);
    }

    sendDrawing(drawingData) {
        this.clientSocket.emit('draw', {
            x: drawingData.x,
            y: drawingData.y,
            type: drawingData.type
          });
    }
}

module.exports = Client;
