/*
	Mark Odell : Drawing Interactive Triangles
    The purpose of this assignment is to be able to interactively draw rectangle shapes with rubberbanding onto a "graph paper" canvas. We use the term rubberbanding for when refering to when a mouse click is up or down.
*/
var ID_color_picker = 'color',
    ID_brush_select = 'brush',
    ID_erase_button = 'erase';
var COLOR_fill,
    COLOR_stroke,
    TOOL_brush,
    GRAPH_COLOR = "paleTurquoise",
    GRAPH_UNITS = 20; 
var canvas, ctx, firstPt, secondPt, lastRect, lastImg, isMouseDown;

// Setup function for loading the page
window.onload = function () {
    initalize();
    draw_GraphPaper();
    update_Tools();
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
        // Restore image when first clicked (rubberbanding)
        ctx.putImageData(lastImg, 0, 0);
        // Draw rect from orginal point to currently location
        
    }
}

// ExtraC: Add UI somewhere that give coordinates of where
// mouse is currently, regards of being clicked.



function draw_selectedShape(pt1, pt2, color){
    if(TOOL_brush == 'line') {
        draw_aLine(color, pt1, pt2);
    } else if(TOOL_brush == 'rect'){
        lastRect = { x: firstPt.x,
                     y: firstPt.y,
                     w: event.clientX - canvas.offsetLeft - firstPt.x,
                     h: event.clientY - canvas.offsetTop - firstPt.y };
        draw_aRect(null, null, lastRect);
    } else if (TOOL_brush == 'tri') {

    } else if (TOOL_brush == 'eclipse') {

    }
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

    ctx.restore();
}
/*
    Simple helper functions to draw shapes
*/
function draw_aRect(c_fill, c_stroke, aRect) {
    ctx.save(); // Saves state of ctx vars

    ctx.fillStyle = c_fill || COLOR_fill;
    ctx.strokeStyle = c_stroke || COLOR_stroke;
    ctx.strokeRect(aRect.x, aRect.y, aRect.w, aRect.h);
    ctx.fillRect(aRect.x, aRect.y, aRect.w, aRect.h);

    ctx.restore(); // So that we get the saved vars back
}
function draw_aLine(c_stroke, pt1, pt2){
    ctx.save();

    ctx.strokeStyle = c_stroke || COLOR_stroke;
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);

    ctx.restore();
}
function draw_aTriangle(c_stroke, pt1, pt2){
    
}
/* Simple function to get values of HTML UI elements*/
function update_Tools() {
    COLOR_stroke = document.getElementById(ID_color_picker).value;
    COLOR_fill = hex_to_rgba(COLOR_stroke, 0.4);

    // Need to specify and save function for different shapes.
    TOOL_brush = document.getElementById(ID_brush_select).value;
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
/*-------- END Functional Code ---------*/

/* Some Setup functions I use to make the page look nice-er */

/* Some setup for the Canvas */
window.onresize = do_resize;
function do_resize() {
	canvas.width = window.innerWidth - 25;
    canvas.height = window.innerHeight - 15;
    draw_GraphPaper();
}
function add_Listeners(){
    canvas.addEventListener("mousedown", do_mouseDown);
    canvas.addEventListener("mouseup", do_mouseUp);
    canvas.addEventListener("mousemove", do_mouseAt);
    document.getElementById(ID_erase_button).onclick = function(){do_resize()};
    document.getElementById(ID_color_picker).onchange = function(){update_Tools()};
    document.getElementById(ID_brush_select).onselect = function(){update_Tools()};
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
    do_resize();
}
