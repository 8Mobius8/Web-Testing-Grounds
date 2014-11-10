/*
    Mark Odell : Retain Mode
    The purpose of this assignment was to create a canvas web app to save and retain shapes so that they
    may transformed later. Transformations included rotatation and translation. 
*/
/* Some CONSTANTS */
var GRAPH_COLOR = "paleTurquoise",
    GRAPH_UNITS = 20,
    ID_erase_button = "erase", ID_brush_type = "brush", ID_color_picker = "color-picker", ID_mode_picker = "modepicker",
    MESSAGE_BOX = {x:0, y:0, w:215, h:20, margin: 10, font: "14px Helvetica"}; // Initalized for UI box

/* Global Variables */
var canvas, ctx,
    p_one, p_two, offset, a_offset,
    shapeStack, prevImg, shapeDrawn,
    rubberBanding, modeSelect,
    activeListeners = [];

// Setup function for loading the page
window.onload = function () {
  initalize();
  draw_GraphPaper();
  showMessage("Welcome!");
  shapeStack = [];

  modeSelect = document.getElementById(ID_mode_picker);
  function changeMode(event) { window[modeSelect.value]();}
  modeSelect.addEventListener("change", changeMode);
  changeMode();
  canvas.addEventListener("mousemove", mouseAt);
};


 //================================\\
//-------Functional Listeners-------\\

function mouseAt(event) {
    var x = event.clientX - canvas.offsetLeft,
      y = event.clientY - canvas.offsetTop;
    showCoordinates(x, y);
}

function drawMode() {
  removeCanvasListeners();
  addCanvasListener("mousedown", startRubberband);
  addCanvasListener("mousemove", moveRubberband);
  addCanvasListener("mouseup", endRubberband);
  addCanvasListener("mouseAt", mouseAt);
  canvas.style.cursor = 'crosshair';
}
// For drawMode()
function startRubberband() {
    p_one = { x:event.clientX - canvas.offsetLeft,
              y:event.clientY - canvas.offsetTop  };
    prevImg = ctx.getImageData(0, 0, canvas.height*2, canvas.width*2);
    rubberBanding = true;
}
// For drawMode()
function moveRubberband() {
    p_two = { x:event.clientX - canvas.offsetLeft,
              y:event.clientY - canvas.offsetTop  };

    if(rubberBanding) {
        var stroke = document.getElementById(ID_color_picker).value;
        var fill = hex_to_rgba(stroke, 0.4);
        var brush = document.getElementById(ID_brush_type).value;
        // Restore image when first clicked (rubberbanding)
        ctx.putImageData(prevImg, 0, 0);
        // Draw shape from orginal point to currently location
        draw_selectedShape(brush, p_one, p_two, stroke, fill);
    }
}
// For drawMode()
function endRubberband() {
    shapeStack.push(shapeDrawn);
    rubberBanding = p_one = p_two = undefined;
}

function hitMode() {
  removeCanvasListeners();
  addCanvasListener("click", doHitTest);
  addCanvasListener("mousemove", mouseAt);
  canvas.style.cursor = 'default';
}
function doHitTest(event) {
  var x = event.clientX - canvas.offsetLeft,
      y = event.clientY - canvas.offsetTop;
  var hit = shapeStack.filter(function(shape){
    shape.path();
    return ctx.isPointInPath(x, y);
  });

  hit.forEach(function(shape){
    alert("Shape at (" +shape.x+", "+shape.y+")");
  });
}

function deleteMode() {
  removeCanvasListeners();
  addCanvasListener("click", doDeleteHit);
  addCanvasListener("mousemove", mouseAt);
  canvas.style.cursor = 'default';
}
function doDeleteHit() {
  var x = event.clientX - canvas.offsetLeft,
      y = event.clientY - canvas.offsetTop;
  shapeStack.reverse();
  shapeStack.some(function(shape, i, stack){
      shape.path();
      if(ctx.isPointInPath(x, y)){
        stack.splice(i, 1);
        return true;
      }
  });
  shapeStack.reverse();

  clearRedrawShapes();
  showMessage("Deleted Shape!");
}

function moveMode() {
  removeCanvasListeners();
  addCanvasListener("mousedown", doMoveHit);
  addCanvasListener("mousemove", doMoveDrag);
  addCanvasListener("mouseup", doMoveDone);
  addCanvasListener("mousemove", mouseAt);
  canvas.style.cursor = 'move';
}
// For modeMode()
function doMoveHit() {
  p_one = { x: event.clientX - canvas.offsetLeft,
            y: event.clientY - canvas.offsetTop  };
             
  rubberBanding = true;
}
// For modeMode()
function doMoveDrag() {
  if(rubberBanding) {
    p_two = { x: event.clientX - canvas.offsetLeft,
              y: event.clientY - canvas.offsetTop  };
    offset = Point(p_two.x - p_one.x, p_two.y - p_one.y);
    clearShapes();
    shapeStack.forEach(function(shape){
      shape.path();
      if(ctx.isPointInPath(p_one.x, p_one.y)){
        ctx.save();
        ctx.translate(offset.x, offset.y);
        shape.draw();
        ctx.restore();
      } else {
        shape.draw();
      }
    });
  }
}
// For modeMode()
function doMoveDone() {
  shapeStack.some(function(shape){
    shape.path();
    if(ctx.isPointInPath(p_one.x, p_one.y)){
      shape.x += offset.x;
      shape.y += offset.y;
      shape.center.x += offset.x;
      shape.center.y += offset.y;
    }
  });
  rubberBanding = p_one = p_two = undefined;
}

function rotateMode() {
  removeCanvasListeners();
  addCanvasListener("mousedown", doRotateHit);
  addCanvasListener("mousemove", doRotateDrag);
  addCanvasListener("mouseup", doRotateDone);
  addCanvasListener("mousemove", mouseAt);
  canvas.style.cursor = 'alias';
}
// For rotateMode()
function doRotateHit() {
  p_one = { x: event.clientX - canvas.offsetLeft,
            y: event.clientY - canvas.offsetTop  };
  a_offset = Math.atan((p_one.y-shape.center.y)/(p_one.x-shape.center.x)) - shape.angle; 
  rubberBanding = true;
}
// For rotateMode()
function doRotateDrag() {
  if(rubberBanding){
    p_two = { x: event.clientX - canvas.offsetLeft,
              y: event.clientY - canvas.offsetTop  };
    
    clearShapes();
    shapeStack.forEach(function(shape){
      shape.path();
      if(ctx.isPointInPath(p_one.x, p_one.y)){
        ctx.save();

        offset = Point(shape.x, shape.y);
        shape.angle = Math.atan((p_two.y-shape.center.y)/(p_two.x-shape.center.x)) - a_offset;
        shape.draw();

        ctx.restore();
      } else {
        shape.draw();
      }
    });
  }
}
// For rotateMode()
function doRotateDone() {
  shapeStack.some(function(shape){
    shape.path();
    if(ctx.isPointInPath(p_one.x, p_one.y)){
      shape.angle += a_offset;
    }
  });
  rubberBanding = p_one = p_two = offset = undefined;
}

//-------   END Listeners    -------\\
 //================================\\

function draw_selectedShape(tool, pt1, pt2, stroke, fill){
    ctx.save();

    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;

    if(tool == 'line') {
        shapeDrawn = new Line(p_one, p_two, fill, stroke);
    } else if(tool == 'rect'){
        shapeDrawn = new Rect(p_one, p_two, fill, stroke);
    } else if (tool == 'tri') {
        shapeDrawn = new RightTriangle(p_one, p_two, fill, stroke);
    } else if (tool == 'circle') {
        shapeDrawn = new Circle(p_one, p_two, fill, stroke);
    }
    shapeDrawn.draw();

    ctx.restore();
}
function clearShapes() {
  showMessage.boxDrawn = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw_GraphPaper();
}

function clearRedrawShapes() {
  showMessage.boxDrawn = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw_GraphPaper();
  shapeStack.forEach(function(shape){
    shape.draw();
  });
}

/*-------- END Functional Code ---------*/

/*-- Common Functions for Canvas --*/
function initalize(){
    canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        canvas.style.backgroundColor = 'white';
    } else {
        alert('Canvas could not be found by ID:' + canvas);
        return;
    }
    document.getElementById(ID_erase_button).onclick = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw_GraphPaper();
    };
    canvas.width = window.innerWidth - 25;
    canvas.height = window.innerHeight - 15;
    MESSAGE_BOX.x = MESSAGE_BOX.margin;
    MESSAGE_BOX.y = canvas.height - (MESSAGE_BOX.h +MESSAGE_BOX.margin);
}

window.onresize = do_resize;
function do_resize() {
    lastImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth - 25;
    canvas.height = window.innerHeight - 15;
    ctx.putImageData(lastImg, 0, 0);
    MESSAGE_BOX.x = MESSAGE_BOX.margin;
    MESSAGE_BOX.y = canvas.height - (MESSAGE_BOX.h +MESSAGE_BOX.margin);
    showMessage("RESIZED!");
}

function hex_to_rgba(hexColor, alpha) {
    var red, green, blue, color;
    red = hexColor[1] + hexColor[2];
    green = hexColor[3] + hexColor[4];
    blue = hexColor[5] + hexColor[6];

    color = 'rgba(' + parseInt('0x' + red) +', ';
    color += parseInt('0x' + green)+', ';
    color += parseInt('0x' + blue)+', ' + alpha;

    return color;
}

/*-=-=-=-= Functions for Path creation =-=-=-=-*/
function Point(x, y) {
    return {x: x, y: y};
}
function drawShape() {
  ctx.save();
  ctx.fillStyle = this.fill;
  ctx.strokeStyle = this.stroke;
  this.path();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function Rect(p1, p2, fill, stroke) {
  this.fill = fill;
  this.stroke = stroke;
  this.x = p1.x;
  this.y = p1.y;
  this.w = p2.x - p1.x;
  this.h = p2.y - p1.y;
  this.center = Point((this.x*2+this.w)/2, (this.y*2+this.h)/2);
  this.angle = 0;
}
Rect.prototype.path = function() {
  ctx.beginPath();
  if(this.angle != 0) {
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(this.angle);
    ctx.translate(-this.center.x, -this.center.y);
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.restore();
  } else {
    ctx.rect(this.x, this.y, this.w, this.h);
  }
}
Rect.prototype.draw = drawShape;

function Line(p1, p2, fill, stroke) {
  this.fill = fill;
  this.stroke = stroke;
  this.x = p1.x;
  this.y = p1.y;
  this.pt1 = p1;
  this.pt2 = p2;
  this.center = Point((this.x+this.w)/2, (this.y+this.h)/2);
  this.angle = 0;
}
Line.prototype.path = function() {
  ctx.beginPath();
  if(this.angle != 0) {
    ctx.rotate(this.angle);
  }
  ctx.moveTo(this.pt1.x, this.pt1.y);
  ctx.lineTo(this.pt2.x, this.pt2.y);
  if(this.angle != 0) {
    ctx.rotate(-this.angle);
  }
}
Line.prototype.draw = function() {
  ctx.save();
  this.path();
  ctx.stroke();
  ctx.restore();
}

function RightTriangle(p1, p2, fill, stroke) {
  this.fill = fill;
  this.stroke = stroke;
  this.x = p1.x;
  this.y = p1.y;
  this.w = p2.x - p1.x;
  this.h = p2.y - p1.y;
  this.center = Point(2/3*(this.w-this.x)+this.x, 2/3*(this.h-this.y)+this.y);
  this.angle = 0;
}
RightTriangle.prototype.path = function() {
  ctx.beginPath();
  if(this.angle != 0){
    ctx.rotate(this.angle);
  }
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.x, this.y+this.h);
  ctx.lineTo(this.x+this.w, this.y+this.h);
  if(this.angle != 0) {
    ctx.rotate(-this.angle);
  }
  ctx.closePath();
}
RightTriangle.prototype.draw = drawShape;

function Circle(p1, p2, fill, stroke) {
  this.fill = fill;
  this.stroke = stroke;
  this.x = p1.x;
  this.y = p1.y; 
  this.center = Point(this.x, this.y);
  this.r = distance(p1, p2);
  this.angle = 0;

}
Circle.prototype.path = function() {
  ctx.beginPath();
  if(this.angle != 0){
    ctx.rotate(this.angle);
  }
  ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
  if(this.angle != 0) {
    ctx.rotate(-this.angle);
  }
  ctx.closePath();
}
Circle.prototype.draw = drawShape;

function distance(pt1, pt2) {
    return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
}
/*-=-= Simple helper functions to draw shapes =-=-*/

/*
 *  Draws a engineering like graph paper on the canvas
 *  with the given color and unit parameters. This function
 *  defaults to the globally defined variables for color and units.
 *  Thanks Prof Mildrew for the algorithm
 *  @param color    A color string
 *  @param units    Number of pixels to determine the square size
 */
function draw_GraphPaper(color, units) {
    ctx.save();

    ctx.strokeStyle = color || GRAPH_COLOR;
    ctx.beginPath();
    var i = 0.5;
    while(i <= canvas.width || i <= canvas.height) {
        if(i <= canvas.width){
            ctx.moveTo(i, 0.5);
            ctx.lineTo(i, canvas.height);
        }
        if(i <= canvas.height){
            ctx.moveTo(0.5, i);
            ctx.lineTo(canvas.width, i);
        }
        i += units || GRAPH_UNITS;
    }
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function redrawCanvas() {
  initalize();
}

/*========= Code Adapted from Jim Mildrew =======*/

function addCanvasListener(event, functionObj) {
  canvas.addEventListener(event, functionObj);
  activeListeners.push({event: event, func: functionObj});
}

function removeCanvasListeners() {
  activeListeners.forEach(
    function(listener) {
      canvas.removeEventListener(listener.event, listener.func);
    }
  );
  activeListeners = [];
}

function drawUIBox(x, y, width, height) {  
  ctx.save();

  ctx.fillStyle = "black";
  ctx.strokeStyle = "red";
  ctx.shadowColor = "grey";
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 15;
  ctx.strokeRect(x, y, width, height);
  ctx.fillRect(x, y, width, height);

  ctx.restore();
}


// Messages --------------------------------------------------

function showMessage(string) {
  
  ctx.save();
  
  // draw the box exterior
  if (!showMessage.boxDrawn) {
    drawUIBox(MESSAGE_BOX.x, MESSAGE_BOX.y, MESSAGE_BOX.w, MESSAGE_BOX.h);
    showMessage.boxDrawn = true; // prevent redraw of the box
  }
  
  // draw the box contents
  ctx.fillStyle = "black";
  ctx.fillRect(MESSAGE_BOX.x, MESSAGE_BOX.y, MESSAGE_BOX.w, MESSAGE_BOX.h);
  ctx.fillStyle = "white";
  ctx.strokeStyle = "grey";
  ctx.font = MESSAGE_BOX.font;
  ctx.fillText(string, MESSAGE_BOX.x + 7, MESSAGE_BOX.y+ 15);

  ctx.restore();
}

function showCoordinates(x, y) {
  var coordinateString = "mouse location: (" + x + ", " + y + ")";
  showMessage(coordinateString);
}
