(function() {
  var App;
  App = {};
  /*
  	Init 
  */
  App.init = function() {
    App.canvas = document.createElement('canvas');
    App.canvas.height = 400;
    App.canvas.width = 800;
    document.getElementsByTagName('article')[0].appendChild(App.canvas);
    App.ctx = App.canvas.getContext("2d");
    App.ctx.fillStyle = "solid";
    App.ctx.strokeStyle = "#FF0000";
    App.ctx.lineWidth = 2;
    App.ctx.lineCap = "round";
    App.socket = io.connect('http://localhost:4000/boards?boardId=1');
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
  $('canvas').live('drag dragstart dragend', function(e) {
    type = e.handleObj.type;
    x = e.layerX;
    y = e.layerY;
    App.draw(x, y, type);
    App.socket.emit('drawing', {
      x: x,
      y: y,
      type: type
    });
  });
  $(function() {
    return App.init();
  });
}).call(this);
