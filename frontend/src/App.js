import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client'; 
import $ from 'jquery';
import  {Form, Button} from 'react-bootstrap';


class App extends Component {
  
  constructor(props) {
    super(props);
    this.stateData = {userId: 'koral', boardId: '1'};
    this.canvasData = null;
    this.responseData = null;
    this.state = {
      showComponent: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();
    this.sendDataToServer();
  }


  sendDataToServer() {
    return fetch('login/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: this.stateData.userId,
      boardId: this.stateData.boardId,
    })
  }).then(function(response){
    console.log(response);	  
    return response.json();
   }).then((data) =>{
    this.responseData = data
    this.setState({
      showComponent: true,
    });  
   })
  }

  handleSaveUserData(){
    alert('need to insert that');
  }

 
  render() {
    return (
      <div>
    <Form onSubmit={this.handleSubmit}>
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
      <Button variant="primary" type="submit">
        Connect
      </Button>
    </Form>
    {this.state.showComponent ?
      <Canvas 
              userId={this.stateData.userId}
              responseData={this.responseData} />:
      null
   }
    </div>
  );  
  }

}


export default App;


class Canvas extends Component {
  
  constructor(props) {
    super(props);
    this.userId = this.props.userId;
    this.sessionData = {
      sessionId: this.props.responseData.sessionId, height: this.props.responseData.canvasProperties.height, width : this.props.responseData.canvasProperties.width, fillStyle: this.props.responseData.canvasProperties.fillStyle, 
      strokeStyle: this.props.responseData.canvasProperties.strokeStyle, lineWidth: this.props.responseData.canvasProperties.lineWidth, lineCap: this.props.responseData.canvasProperties.lineCap
    }
    //this.loadCanvas();
    this.screenShotAction = this.screenShotAction.bind(this);
    this.canvasRef = React.createRef();
  }

  render() {
    return <canvas  ref="canvas" width={this.sessionData.width} height={this.sessionData.height}/>;
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

  /*loadCanvas() {
    var App;
    App = {};
  
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
}*/
  
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