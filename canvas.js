/*
    Mark Odell : Canvas Demos
*/
var GRAPH_COLOR = "paleTurquoise",
    GRAPH_UNITS = 20,
    ID_erase_button = "erase";
var canvas, ctx;

// Setup function for loading the page
window.onload = function () {
    initalize();
    draw_GraphPaper();
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
    do_resize();
}

window.onresize = do_resize;
function do_resize() {
    lastImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth - 25;
    canvas.height = window.innerHeight - 15;
    ctx.putImageData(lastImg, 0, 0);
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

function p_Point(x, y) {
    return {x: x, y: y};
}

function p_distance(pt1, pt2) {
    return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
}

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

/*========= Code Adapted from Jim Mildrew =======*/
function drawUIBox(x, y, width, height) {  
  ctx.save();

  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.shadowColor = "black";
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 15;
  ctx.strokeRect(x, y, width, height);
  ctx.fillRect(x, y, width, height);
  
  ctx.restore();
}


// Messages --------------------------------------------------

function showMessage(string) {

  var box = {x: 10, y: 470, width: 180, height: 20};
  
  ctx.save();
  
  // draw the box exterior
  if (!showMessage.boxDrawn) {
    drawUIBox(box.x, box.y, box.width, box.height);
    showMessage.boxDrawn = true; // prevent redraw of the box
  }
  
  // draw the box contents
  ctx.fillStyle = "white";
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";
  ctx.fillText(string, box.x + 7, box.y+ 15);
  ctx.restore();
}

// test: showMessage
//showMessage("Ready to draw?");


function showCoordinates(x, y) {
  var coordinateString = "mouse location: (" + x + ", " + y + ")";
  showMessage(coordinateString);
}
