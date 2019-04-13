import React, { Component } from 'react';
import io from 'socket.io-client'; 
import {$} from 'jquery';


class Canvas extends Component {
  
    constructor(props, responseData, userId) {
      super(props);
      this.userId = userId;
      this.sessionData = {
        sessionId: responseData.sessionId, height: props.responseData.height, width : responseData.width, fillStyle: responseData.fillStyle, 
        strokeStyle: responseData.strokeStyle, lineWidth: responseData.lineWidth, lineCap: responseData.lineCap
      }
      this.loadCanvas();
      this.screenShotAction = this.screenShotAction.bind(this);

    }
  
    loadCanvas() {
      var App;
      App = {};
      /*
          Init 
      */
      function renderCanvas(canvasCtx, canvasBuff) {
    
        var blob = new Blob([canvasBuff], {type: 'image/png'});
        var url = URL.createObjectURL(blob);
        var img = new Image();
    
        img.onload = function() {
            canvasCtx.drawImage(this, 0, 0);
            URL.revokeObjectURL(url);
        }
        img.src = url;
      }
    
    
      App.init = function() {
        App.canvas = document.createElement('canvas');
        App.canvas.className = 'canvas';
        App.canvas.height = this.height;
        App.canvas.width = this.width;
        document.getElementsByTagName('article')[0].appendChild(App.canvas);
        App.ctx = App.canvas.getContext("2d");
        App.ctx.fillStyle = this.fillStyle;
        App.ctx.strokeStyle = this.strokeStyle;
        App.ctx.lineWidth = this.lineWidth;
        App.ctx.lineCap = this.lineCap;
        App.socket =  io.connect('http://localhost:4000/clients?clientId=' + this.userId+ '&sessionId='+ this.sessionData.sessionId);
        App.socket.on('canvas', canvasBuff => {
          renderCanvas(App.ctx, canvasBuff);
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
      };
      /*
          Draw Events
      */
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
      $(function() {
        return App.init();
      });
    }
  
    screenShotAction(filename){    //download the img
        var canvas = document.getElementsByClassName('canvas')[0];
        var lnk = document.createElement('a'), e;
        lnk.download = filename;
        lnk.href = canvas.toDataURL("image/png;base64");
        /// create a "fake" click-event to trigger the download
        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
                          0, 0, 0, 0, 0, false, false, false,
                          false, 0, null);
      
        lnk.dispatchEvent(e);
      };


    screenShopButton(){
        var button = document.createElement('button');
        button.innerHTML = 'Screen Shot';
        button.className = "btn btn-primary";
        button.onclick = function(){
          this.screenShotAction('mycanvas.png');
        };
        document.body.appendChild(button);
      };


      
  }

  export default Canvas;
