const fs = require('fs');
const canvas = require('canvas');
const Drawing = require('./drawing');
const Bluebird = require('bluebird');
const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 800;
const FILL_STYLE = "solid";
const STROKE_STYLE = "#000000";
const LINE_WIDTH = 2;
const LINE_CAP = "round";

class BoardCanvas {
    constructor(canvasProperties) {
        this.canvasProperties = canvasProperties;
        
        let height = canvasProperties.height || CANVAS_HEIGHT;
        let width = canvasProperties.width || CANVAS_WIDTH;
        this.canvas = canvas.createCanvas(height, width);
        this.canvasContext = this.canvas.getContext('2d');

        this.canvasContext.fillStyle = canvasProperties.fillStyle || FILL_STYLE;
        this.canvasContext.strokeStyle = canvasProperties.strokeStyle || STROKE_STYLE;
        this.canvasContext.lineWidth = canvasProperties.lineWidth || LINE_WIDTH;
        this.canvasContext.lineCap = canvasProperties.lineCap || LINE_CAP;
        
        this.canvas.toBufferP = Bluebird.promisify(this.canvas.toBuffer);        
    }
    
    draw(drawingData) {
        return Drawing.draw(this.canvasContext, drawingData);
    }
    
    async getCanvas() {
        return this.canvas.toBufferP();
    }

    getCanvasProperties() {
        return this.canvasProperties;
    }
}

module.exports = BoardCanvas;
