import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client'; 
import {$} from 'jquery';
import  {Form, Button} from 'react-bootstrap';


class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {userId: 'koral', boardId: '1'};
    this.sessionData = {
      sessionId: null, height: null, width : null, fillStyle: null, 
      strokeStyle: null, lineWidth: null, lineCap: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  async handleSubmit(event){
    let responseData = await this.sendDataToServer();
    this.handlerResponse(responseData);
  }


  sendDataToServer() {
    return fetch('login/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: this.state.userId,
      boardId: this.state.boardId,
    })
  }).then(function(response){ 
    return response.json();   
   })
  }

  handlerResponse(responseData){
    alert('show canvas with meta data');
  }

  handleSaveUserData(){
    alert('need to insert that');
  }

 
  render() {
    return (
    <Form>
      <Form.Group controlId="UserName">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="text" name="clientId" defaultValue={this.state.userId} placeholder="Enter User Name" />
      </Form.Group>
      <Form.Group controlId="boardId">
        <Form.Label>boardId</Form.Label>
        <Form.Control type="number" defaultValue={this.state.boardId} placeholder="board Id" />
       </Form.Group>
      <Form.Group controlId="formBasicChecbox">
        <Form.Check type="checkbox" label="Remmember me" onClick={this.handleSaveUserData}/>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={this.handleSubmit}>
        Connect
      </Button>
    </Form>
    );
  }

}

function loadCanvas(clientid, sessionId) {
  var App;
  App = {};
  /*
      Init 
  */
  function renderCanvas(canvasCtx, canvasBuff) {

    var blob = new Blob([canvasBuff], {type: 'image/png'});
    var url = URL.createObjectURL(blob);
    var img = new Image;

    img.onload = function() {
        canvasCtx.drawImage(this, 0, 0);
        URL.revokeObjectURL(url);
    }
    img.src = url;
  }


  App.init = function() {
    App.canvas = document.createElement('canvas');
    App.canvas.className = 'canvas';
    App.canvas.height = 600;
    App.canvas.width = 1000;
    document.getElementsByTagName('article')[0].appendChild(App.canvas);
    App.ctx = App.canvas.getContext("2d");
    App.ctx.fillStyle = "solid";
    App.ctx.strokeStyle = "#333";
    App.ctx.lineWidth = 2;
    App.ctx.lineCap = "round";
    App.socket =  io.connect('http://localhost:3000/clients?clientId=' + clientid+ '&sessionId='+ sessionId);
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



var screenShopButton = function(){
  var button = document.createElement('button');
  button.innerHTML = 'Screen Shot';
  button.className = "btn btn-primary";
  button.onclick = function(){
    screenShotAction('mycanvas.png');
  };
  document.body.appendChild(button);
};

function screenShotAction(filename){    //download the img
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

export default App;
