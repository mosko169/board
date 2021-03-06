const CanvasProperties = require('./canvas_properties');
const canvas = require('canvas');
const Drawing = require('./drawing');
const Bluebird = require('bluebird');
const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 800;
const FILL_STYLE = "solid";
const STROKE_STYLE = "#000000";
const LINE_WIDTH = 2;
const LINE_CAP = "round";

const DEFAULT_CANVAS_PROPERTIES = new CanvasProperties(CANVAS_HEIGHT,
     CANVAS_WIDTH, 
     FILL_STYLE, 
     STROKE_STYLE, 
     LINE_WIDTH, 
     LINE_CAP);

class BoardCanvas {
    constructor(canvasProperties = DEFAULT_CANVAS_PROPERTIES) {
        this.canvasProperties = canvasProperties;
        
        let height = canvasProperties.height || CANVAS_HEIGHT;
        let width = canvasProperties.width || CANVAS_WIDTH;
        this.canvas = canvas.createCanvas(width, height);
        this.canvasContext = this.canvas.getContext('2d');

        this.canvasContext.fillStyle = "white";
        this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.canvasContext.fillStyle = canvasProperties.fillStyle || FILL_STYLE;
        this.canvasContext.strokeStyle = canvasProperties.strokeStyle || STROKE_STYLE;
        this.canvasContext.lineWidth = canvasProperties.lineWidth || LINE_WIDTH;
        this.canvasContext.lineCap = canvasProperties.lineCap || LINE_CAP;
        
    }
    
    draw(drawingData) {
        return Drawing.draw(this.canvasContext, drawingData);
    }
    
    getCanvas() {
        return this.canvas.toBuffer();
    }

    getCanvasProperties() {
        return this.canvasProperties;
    }
}

module.exports = BoardCanvas;
