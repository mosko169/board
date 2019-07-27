
class Recorder {
    constructor(canvas, encoder, frameRate) {
        this.canvas = canvas;
        this.encoder = encoder;
        this.frameRate = frameRate;
    }

    start() {
        this.encoder.start();
        this.sampler = setInterval(this._sampleFrame.bind(this), this.frameRate);
    }

    stop() {
        clearInterval(this.sampler);
        return this.encoder.stop();
    }

    get outputPath() {
        return this.encoder.outputPath;
    }

    _sampleFrame() {
        let frame = this.canvas.getCanvas();
        this.encoder.processFrame(frame);
    }

}

module.exports = Recorder;
