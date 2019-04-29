
const Recorder = require('./recorder');
const Encoder = require('./ffmpeg_encoder');

const path = require('path');

const FRAME_RATE = 1000 / 24;

class RecorderProvider {
    constructor(recordsPath) {
        this.recordsPath = recordsPath;
    }

    getRecorder(sessionId, boardCanvas)  {
        let encoder = new Encoder(FRAME_RATE, path.join(this.recordsPath, sessionId), Encoder.FORMAT);
        let recorder = new Recorder(boardCanvas, encoder, FRAME_RATE);
        return recorder;
    }
}

module.exports = RecorderProvider;
