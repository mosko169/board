
const EventEmitter = require('events');

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');


class SerialBoard extends EventEmitter {
    constructor(serialPortName) {
        super()
        this.serialPort = new SerialPort(serialPortName, { baudRate: 9600 });
        this.parser = this.serialPort.pipe(new Readline({ delimiter: '\n' }));

        this.serialPort.on("open", () => {
            console.log('serial port open');
          });
          
        this.parser.on('data', this._handleInput.bind(this));

        this.dragging = false;
    }

    _parseInput(input) {
        let [x, y, pressed] = input.split(",").map(v => parseInt(v));
        return {x, y, pressed};
    }

    _handleInput(input) {
        let {x, y, pressed} = this._parseInput(input);
        if (this.dragging) {
            this._handleInputWhileDragging(x, y, pressed);
        } else {
            this._handleInputWhileNotDragging(x, y, pressed);
        }
    }

    _handleInputWhileDragging(x, y, pressed) {
        if (!pressed) {
            this.dragging = false;
            this.emit('drawing', {type:'dragend'});
        } else {
            this.emit('drawing', {type:'drag', x: x, y: y})
        }
    }

    _handleInputWhileNotDragging(x, y, pressed) {
        if (pressed) {
            this.dragging = true;
            this.emit('drawing', {type:'dragstart', x: x, y: y});
        }
    }

}

module.exports = SerialBoard;
