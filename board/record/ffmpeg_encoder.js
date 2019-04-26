const spawn = require('child_process').spawn;

const FFMPEG_PATH = "C:\\ffmpeg\\bin\\ffmpeg.exe";

class FFMPEGEncoder {
    constructor(frameRate, outputFile) {
        this.outputFile = outputFile;
        this.frameRate = 1000 / frameRate;
    }

    start() {
        let ffmpegArgs = ['-hide_banner', '-y', '-f', 'image2pipe', '-r', this.frameRate, '-i', '-', '-pix_fmt', 'yuv420p', '-r', this.frameRate, this.outputFile];
        this.ffmpegProcess = spawn(FFMPEG_PATH, ffmpegArgs)
        this.framesPipe = this.ffmpegProcess.stdin;
        this.ffmpegProcess.stdout.pipe(process.stdout);
        this.ffmpegProcess.stderr.pipe(process.stderr);
    }

    processFrame(frame) {
        this.framesPipe.write(frame);
    }

    async stop() {
        let encoderFinishResolveFun;
        let encoderFinishP = new Promise((resolve,reject) => {
            encoderFinishResolveFun = resolve;
        });

        this.ffmpegProcess.on('exit', function() {
            encoderFinishResolveFun();
          })
        this.framesPipe.end();
        return encoderFinishP;
    }
}

module.exports = FFMPEGEncoder;
