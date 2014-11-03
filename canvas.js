/*
    Mark Odell : Canvas Demos
*/
/* Some CONSTANTS */
var GRAPH_COLOR = "paleTurquoise",
    GRAPH_UNITS = 20,
    ID_erase_button = "erase", ID_brush_type = "brush",
    MESSAGE_BOX = {x:0, y:0, w:215, h:20, margin: 10, font: "14px Helvetica"}; // Initalized for UI box

/* Global Variables */
var canvas, ctx;
var shapeToDraw;

// Setup function for loading the page
window.onload = function () {
    initalize();
    draw_GraphPaper();
    showMessage("Welcome!");
    add_Listener("mousedown", do_mouseDown);
    add_Listener("mouseup", do_mouseUp);
    add_Listener("mousemove", do_mouseAt);
};

// Functional Listeners
function do_mouseDown(event) {
    
}

function do_mouseUp(event){
    
}

function do_mouseAt(event){
    var x = event.clientX - canvas.offsetLeft,
        y = event.clientY - canvas.offsetTop;

    showCoordinates(x, y);
}
// End of Listeners






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

function add_Listener(name, funcToAdd){
    canvas.addEventListener(name, funcToAdd);
}

function rm_Listeners() {

}

function hex_to_rgba(hexColor, alpha) {
    var red, green, blue, color;
    red = hexColor[1] + hexColor[2];
    green = hexColor[3] + hexColor[4];
    blue = hexColor[5] + hexColor[6];

    color = 'rgba(' + parseInt(red) +', ';
    color += parseInt(green)+', ';
    color += parseInt(blue)+', ' + alpha;

    return color;
}

/*-=-=-=-= Functions for Path creation =-=-=-=-*/
function p_Point(x, y) {
    return {x: x, y: y};
}

function p_distance(pt1, pt2) {
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
    var r = p_distance(pt1, pt2);
    ctx.beginPath();
    ctx.arc(pt1.x, pt1.y, r, 0, Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}


/*========= Code Adapted from Jim Mildrew =======*/
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
