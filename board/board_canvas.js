const JSDOM = require("jsdom");
const dataUriToBuffer = require('data-uri-to-buffer');
const CanvasProperties = require('./canvas_properties');
const Drawing = require('./drawing');
const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 800;
const FILL_STYLE = "solid";
const STROKE_STYLE = "#000000";
const LINE_WIDTH = 2;
const LINE_CAP = "round";

const Recorder = require('./record');

const BOARD_CANVAS_TAG_ID = "boardCanvas";

const DEFAULT_CANVAS_PROPERTIES = new CanvasProperties(CANVAS_HEIGHT,
     CANVAS_WIDTH, 
     FILL_STYLE, 
     STROKE_STYLE, 
     LINE_WIDTH, 
     LINE_CAP);

class BoardCanvas {
    constructor(canvasProperties = DEFAULT_CANVAS_PROPERTIES) {
        this.canvasProperties = canvasProperties;
        
        this.height = canvasProperties.height || CANVAS_HEIGHT;
        this.width = canvasProperties.width || CANVAS_WIDTH;
    }

    async init() {
        let html = `
                        <body>
                        <script src='node_modules/ccapture.js/build/CCapture.all.min.js'></script>
                        <canvas id='${BOARD_CANVAS_TAG_ID}' width='${this.width}' height='${this.height}'></canvas>
                        </body>
                    `;

        this.window = new JSDOM.JSDOM(html,
                                        {
                                            runScripts: "dangerously",
                                            resources: "usable",
                                            url: "file://" + 'C:/git/board/',
                                        }
                                    ).window;
        let resolveFun;
        let loadP = new Promise((resolve, reject) => {
            resolveFun = resolve;
        });
        let document = this.window.document;
        this.window.onload = () => {
            this.canvas = document.getElementById(BOARD_CANVAS_TAG_ID);
            this.canvasContext = this.canvas.getContext('2d');
            this.canvasContext.fillStyle = this.canvasProperties.fillStyle || FILL_STYLE;
            this.canvasContext.strokeStyle = this.canvasProperties.strokeStyle || STROKE_STYLE;
            this.canvasContext.lineWidth = this.canvasProperties.lineWidth || LINE_WIDTH;
            this.canvasContext.lineCap = this.canvasProperties.lineCap || LINE_CAP;

            let capturer = new this.window.CCapture({
                format: "png",
                framerate: 1,
              });
            this.recorder = new Recorder(this.canvas, capturer, this.window);
            this.recorder.start();
            resolveFun();
        }
        return loadP;
    }
    
    draw(drawingData) {
        Drawing.draw(this.canvasContext, drawingData);
    }
    
    getCanvas() {
        return dataUriToBuffer(this.canvas.toDataURL());
    }

    getCanvasProperties() {
        return this.canvasProperties;
    }

    terminate() {
        this.recorder.stop();
    }
}

module.exports = BoardCanvas;
