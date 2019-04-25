const JSDOM = require("jsdom");
const fs = require("fs");


class Recorder {
  constructor(canvas, capturer, window) {
    this.canvas = canvas;
    this.capturer = capturer;
    this.window = window;
  }

  start() {
    this.capturer.start();
    this.captureInterval = setInterval(() => {
      this.capturer.capture(this.canvas);
    }, 1000);

  }

  stop() {
    clearInterval(this.captureInterval);
    this.capturer.stop();
    this.capturer.save(blob => {
      const reader = new this.window.FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);

        // Sync for simplicity
        fs.writeFileSync("./images.tar", uint8Array, { encoding: "binary" });
      };

      reader.readAsArrayBuffer(blob);
    })
  }
}

module.exports = Recorder;
