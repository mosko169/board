const fs = require('fs');
const canvas = require('canvas');
const Drawing = require('./drawing');
const Bluebird = require('bluebird');
const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 800;

class BoardCanvas {
    constructor(options = {}) {
        let height = options.height || CANVAS_HEIGHT;
        let width = options.width || CANVAS_WIDTH;
        this.canvas = canvas.createCanvas(height, width);
        this.canvasContext = this.canvas.getContext('2d');
        this.canvas.toBufferP = Bluebird.promisify(this.canvas.toBuffer);        
    }
    
    draw(drawingData) {
        return Drawing.draw(this.canvasContext, drawingData);
    }
    
    async getCanvas() {
        return this.canvas.toBufferP();
    }
}

module.exports = BoardCanvas;
