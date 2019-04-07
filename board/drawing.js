
class Drawing {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    static draw(canvasCtx, drawingData) {
      let x = drawingData.x;
      let y = drawingData.y;
      let type = drawingData.type;
      switch (type) {
        case "dragstart":
          canvasCtx.beginPath();
          return canvasCtx.moveTo(x, y);
        case "drag":
          canvasCtx.lineTo(x, y);
          return canvasCtx.stroke();
        case "dragend":
          return canvasCtx.closePath();
      }
    }
}

module.exports = Drawing;
