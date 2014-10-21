/*
	Mark Odell : Drawing Interactive Triangles
    The purpose of this assignment is to be able to interactively draw rectangle shapes with rubberbanding onto a "graph paper" canvas. We use the term rubberbanding for when refering to when a mouse click is up or down.
*/
var ID_color_picker = 'color',
    ID_brush_select = 'brush',
    ID_erase_button = 'erase';
var GRAPH_COLOR = "paleTurquoise",
    GRAPH_UNITS = 20;
var max_w, max_h;
var canvas, ctx, firstPt, secondPt, lastRect, lastImg, isMouseDown;

// Setup function for loading the page
window.onload = function () {
    initalize();
    draw_GraphPaper();
    add_Listeners();
};

/*-------- Mark's Functional Code ---------*/
// Need three listeners: Mouse Down, Mouse Up, Mouse At
function do_mouseDown(event) {
    // Save point where mouse is currently
    firstPt = { x:event.clientX - canvas.offsetLeft,
                y:event.clientY - canvas.offsetTop  };
    // Save image
    lastImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    isMouseDown = true;
}

function do_mouseUp(event){
    isMouseDown = false;
}

function do_mouseAt(event){
    if(isMouseDown){
        var stroke = document.getElementById(ID_color_picker).value;
        var fill = hex_to_rgba(stroke, 0.4);
        var brush = document.getElementById(ID_brush_select).value;
        // Restore image when first clicked (rubberbanding)
        ctx.putImageData(lastImg, 0, 0);
        // Draw shape from orginal point to currently location
        secondPt = { x:event.clientX - canvas.offsetLeft,
                     y:event.clientY - canvas.offsetTop  };
        draw_selectedShape(brush, firstPt, secondPt, stroke, fill);
    }
}

// ExtraC: Add UI somewhere that give coordinates of where
// mouse is currently, regards of being clicked.



function draw_selectedShape(tool, pt1, pt2, stroke, fill){
    ctx.save();

    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;

    if(tool == 'line') {
        draw_aLine(pt1, pt2);
    } else if(tool == 'rect'){
        draw_aRect(pt1, pt2);
    } else if (tool == 'tri') {
        draw_aRightTriangle(pt1, pt2);
    } else if (tool == 'circle') {
        draw_aCircle(pt1, pt2);
    }
    ctx.restore();
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
/*
    Simple helper functions to draw shapes
*/
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
/* Simple function to get values of HTML UI elements*/
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
function p_distance(pt1, pt2) {
    return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
}
/*-------- END Functional Code ---------*/

/* Some Setup functions I use to make the page look nice-er */

/* Some setup for the Canvas */
window.onresize = do_resize;
function do_resize() {
    if(canvas.width > max_w)
        max_w = canvas.width;
    if(canvas.height > max_h)
        max_h = canvas.height;
    lastImg = ctx.getImageData(0, 0, max_w, max_h);
	canvas.width = window.innerWidth - 25;
    canvas.height = window.innerHeight - 15;
    ctx.putImageData(lastImg, 0, 0);
}
function add_Listeners(){
    canvas.addEventListener("mousedown", do_mouseDown);
    canvas.addEventListener("mouseup", do_mouseUp);
    canvas.addEventListener("mousemove", do_mouseAt);
    document.getElementById(ID_erase_button).onclick = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw_GraphPaper();
    };
}
function initalize(){
	canvas = document.getElementById("canvas");
    if (canvas.getContext) {
    	ctx = canvas.getContext('2d');
    	canvas.style.backgroundColor = 'white';
    } else {
    	alert('Canvas could not be found by ID:' + canvas);
    	return;
    }
    max_h = 0;
    max_w = 0;
    do_resize();
}
