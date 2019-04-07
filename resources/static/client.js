function loadCanvas(clientid, boardid) {
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
    App.socket = io.connect('http://localhost:3000/clients?clientId=' + clientid+ '&boardId='+ boardid);
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


function startLoad(data){
  clientid = document.getElementsByName("clientid")[0].value;
  boardid = document.getElementsByName("boardid")[0].value;
  document.body.innerHTML = '';
  var article = document.createElement("article");
  document.body.appendChild(article);
  screenShopButton();
  loadCanvas(clientid, boardid)
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
  canvas = document.getElementsByClassName('canvas')[0];
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