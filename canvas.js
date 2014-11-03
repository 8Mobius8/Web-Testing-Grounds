/*
    Mark Odell : Retain Mode
    The purpose of this assignment was to create a canvas web app to save and retain shapes so that they
    may transformed later. Transformations included rotatation and translation. 
*/
/* Some CONSTANTS */
var GRAPH_COLOR = "paleTurquoise",
    GRAPH_UNITS = 20,
    ID_erase_button = "erase", ID_brush_type = "brush", ID_color_picker = "color-picker", ID_mode_picker = "mode-picker",
    MESSAGE_BOX = {x:0, y:0, w:215, h:20, margin: 10, font: "14px Helvetica"}; // Initalized for UI box

/* Global Variables */
var canvas, ctx,
    p_one, p_two,
    shapeStack, prevImg, shapeDrawn,
    isMouseDown, mode;

// Setup function for loading the page
window.onload = function () {
    initalize();
    draw_GraphPaper();
    showMessage("Welcome!");
    shapeStack = [];
};

// Functional Listeners
function startRubberband() {
    p_one = { x:event.clientX - canvas.offsetLeft,
              y:event.clientY - canvas.offsetTop  };
    prevImg = ctx.getImageData(0, 0, canvas.height, canvas.width);
    isMouseDown = true;
}

function moveRubberband() {
    p_two = { x:event.clientX - canvas.offsetLeft,
              y:event.clientY - canvas.offsetTop  };

    if(isMouseDown) {
        var stroke = document.getElementById(ID_color_picker).value;
        var fill = hex_to_rgba(stroke, 0.4);
        var brush = document.getElementById(ID_brush_type).value;
        // Restore image when first clicked (rubberbanding)
        ctx.putImageData(prevImg, 0, 0);
        // Draw shape from orginal point to currently location
        draw_selectedShape(brush, p_one, p_two, stroke, fill);
    }
}

function endRubberband() {
    shapeStack.push(shapeDrawn);
    isMouseDown = false;
}

function mouseAt() {
    showCoordinates(p_two.x, p_two.y);
}

// End of Listeners
function drawMode() {
    removeCanvasListeners();
    addCanvasListener("mousedown", startRubberband);
    addCanvasListener("mousemove", moveRubberband);
    addCanvasListener("mouseup", endRubberband);
    addCanvasListener("mousemove", mouseAt);
    canvas.style.cursor = 'crosshair';
}


function draw_selectedShape(tool, pt1, pt2, stroke, fill){
    ctx.save();

    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;

    if(tool == 'line') {
        shapeDrawn = p_Line(p_one, p_two);
        draw_aLine(pt1, pt2);
    } else if(tool == 'rect'){
        shapeDrawn = p_Rect(p_one, p_one);
        draw_aRect(pt1, pt2);
    } else if (tool == 'tri') {
        shapeDrawn = p_RightTriangle(p_one, p_two);
        draw_aRightTriangle(pt1, pt2);
    } else if (tool == 'circle') {
        shapeDrawn = p_Circle(p_one, p_two);
        draw_aCircle(pt1, pt2);
    }
    ctx.restore();
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
function p_Point(x, y) {
    return {x: x, y: y};
}
function p_Rect(p1, p2) {
    return {x: p1.x, y: p1.y, w: p2.x - p1.x, h: p2.y - p1.y };
}
function p_Line(p1, p2) {
    return {p_1: p1, p_2: p2};
}
function p_RightTrianglep_Line(p1, p2) {
    return {p_1: p1, p_2: p2};
}
function p_Circle(p1, p2) {
    return {x: p1.x, y: p1.y, r: distance(p1, p2)};
}
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

function draw_aRect(pt1, pt2) {
    aRect = {x: pt1.x,
             y: pt1.y,
             w: pt2.x - pt1.x,
             h: pt2.y - pt1.y };
    ctx.strokeRect(aRect.x, aRect.y, aRect.w, aRect.h);
    ctx.fillRect(aRect.x, aRect.y, aRect.w, aRect.h);
}

function draw_aLine(pt1, pt2) {
    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.closePath();
    ctx.stroke();
}

function draw_aRightTriangle(pt1, pt2) {
    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt1.x, pt2.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

function draw_aCircle(pt1, pt2) {
    var r = distance(pt1, pt2);
    ctx.beginPath();
    ctx.arc(pt1.x, pt1.y, r, 0, Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}


/*========= Code Adapted from Jim Mildrew =======*/
var activeListeners = [];

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

var modeSelect = document.getElementById("mode-picker");

function changeMode(event) { window[modeSelect.value](); }
modeSelect.addEventListener("change", changeMode);
changeMode();

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
