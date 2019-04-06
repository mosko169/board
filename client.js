

class Client {
    constructor(clientSocket, id, boardId) {
        this.clientSocket = clientSocket;
        this.requestedBoarId = boardId;
        this.id = id;
    }

    getRequestedBoardId() {
        return this.requestedBoarId;
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
