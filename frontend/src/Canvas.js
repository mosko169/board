import React, { Component } from 'react';
import io from 'socket.io-client'; 
import $ from 'jquery';
import './Canvas.css'; 

export default class Canvas extends Component {
  
    constructor(props) {
      super(props);
      this.userId = this.props.userId;
      this.sessionData = {
        sessionId: this.props.responseData.sessionId, height: this.props.responseData.canvasProperties.height, width : this.props.responseData.canvasProperties.width, fillStyle: this.props.responseData.canvasProperties.fillStyle, 
        strokeStyle: this.props.responseData.canvasProperties.strokeStyle, lineWidth: this.props.responseData.canvasProperties.lineWidth, lineCap: this.props.responseData.canvasProperties.lineCap
      }
      this.canvasRef = React.createRef();
    }
  
    render() {
      return <canvas  ref="canvas" id="userCanvas" width={this.sessionData.width} height={this.sessionData.height}/>;
    }
  
    componentDidMount() {
      let App = {};
      App.ctx = this.refs.canvas.getContext('2d');
      App.ctx.fillStyle = this.sessionData.fillStyle;
      App.ctx.strokeStyle = this.sessionData.strokeStyle;
      App.ctx.lineWidth = this.sessionData.lineWidth;
      App.ctx.lineCap = this.sessionData.lineCap;
      App.socket =  io.connect('http://localhost:4000/clients?clientId=' + this.userId+ '&sessionId='+ this.sessionData.sessionId);
      App.socket.on('canvas', canvasBuff => {
        this.renderCanvas(App.ctx, canvasBuff);
      })
      App.socket.on('draw', function(data) {
        return App.draw(data.x, data.y, data.type);
      });
      App.draw = function(x, y, type) {
        if (type === "dragstart") {
          App.ctx.beginPath();
          return App.ctx.moveTo(x, y);
        } else if (type === "drag") {
          App.ctx.lineTo(x, y);
          return App.ctx.stroke();
        } else {
          return App.ctx.closePath();
        }
      };
  
  
      $('canvas').on('drag dragstart dragend', function(e) {
        var offset, type, x, y;
        type = e.handleObj.type;
        offset = $(this).offset();
        e.offsetX = e.layerX - offset.left;
        e.offsetY = e.layerY - offset.top;
        x = e.offsetX;
        y = e.offsetY;
        App.draw(x, y, type);
        App.socket.emit('drawClick', {
          x: x,
          y: y,
          type: type
        });
      });

        var filename = 'mycanvas.png';
        var button = document.createElement('button');
        button.innerHTML = 'Screen Shot';
        button.className = "btn btn-primary";
        button.onclick = function screenShot(){
            var canvas = document.getElementById('userCanvas');
            var link = document.createElement('a'), e;
            link.download = filename;
            link.href = canvas.toDataURL("image/png;base64");
            /// create a "fake" click-event to trigger the download
            e = document.createEvent("MouseEvents");
            e.initMouseEvent("click", true, true, window,
                                0, 0, 0, 0, 0, false, false, false,
                                false, 0, null);
            link.dispatchEvent(e);
            }
        document.body.appendChild(button);
    }
  
    renderCanvas(canvasCtx, canvasBuff) {
      var blob = new Blob([canvasBuff], {type: 'image/png'});
      var url = URL.createObjectURL(blob);
      var img = new Image();
  
      img.onload = function() {
          canvasCtx.drawImage(this, 0, 0);
          URL.revokeObjectURL(url);
      }
      img.src = url;
    } 
  
}