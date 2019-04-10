

class Client {
    constructor(clientSocket, id, sessionId) {
        this.clientSocket = clientSocket;
        this.sessionId = sessionId;
        this.id = id;
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
