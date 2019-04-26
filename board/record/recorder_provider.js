
const Recorder = require('./recorder');
const Encoder = require('./ffmpeg_encoder');

const FRAME_RATE = 1000 / 24;

class RecorderProvider {
    getRecorder(sessionId, boardCanvas)  {
        let encoder = new Encoder(FRAME_RATE, sessionId + '.avi');
        let recorder = new Recorder(boardCanvas, encoder, FRAME_RATE);
        return recorder;
    }
}

module.exports = RecorderProvider;
