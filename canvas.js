/*
	Mark Odell : Drawing Interactive Triangles
    The purpose of this assignment is to be able to interactively draw rectangle shapes with rubberbanding onto a "graph paper" canvas. We use the term rubberbanding for when refering to when a mouse click is up or down.
*/
var FULLSCREEN = false;
var REC_FILL_COLOR = "rgba(255, 0, 0, 0.4)",
    REC_STROKE_COLOR = "rgb(255, 0, 0)",
    GRAPH_COLOR = "paleTurquoise",
    GRAPH_UNITS = 20; 
var canvas, ctx, firstPt, secondPt, lastRect, lastImg, isMouseDown;

// Setup function for loading the page
window.onload = function () {
    initalize();
    draw_GraphPaper();
    canvas.addEventListener("mousedown", do_mouseDown);
    canvas.addEventListener("mouseup", do_mouseUp);
    canvas.addEventListener("mousemove", do_mouseAt);

};

// Need three listeners: Mouse Down, Mouse Up
// Mouse Down()
function do_mouseDown(event) {
    // Save point where mouse is currently
    firstPt = { x:event.clientX - canvas.offsetLeft,
                y:event.clientY - canvas.offsetTop  };
    // Save image
    lastImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    isMouseDown = true;
}

// Mouse Up()
function do_mouseUp(event){
    // Save point where mouse is currently
    // secondPt = { x:event.clientX - canvas.offsetLeft,
    //              y:event.clientY - canvas.offsetTop  };
    // Use previously saved point and point from Mouse Down to draw a rect
    // lastRect = { x: firstPt.x,
    //              y: firstPt.y,
    //              w: secondPt.x - firstPt.x,
    //              h: secondPt.y - firstPt.y };
    //draw_aRect(null, null, lastRect);
    isMouseDown = false;
}

// Mouse At()  Executes the mouse moves
function do_mouseAt(event){
    if(isMouseDown){
        // Restore image when first clicked (rubberbanding)
        ctx.putImageData(lastImg, 0, 0);
        // Draw rect from orginal point to currently location
        lastRect = { x: firstPt.x,
                     y: firstPt.y,
                     w: event.clientX - canvas.offsetLeft - firstPt.x,
                     h: event.clientY - canvas.offsetTop - firstPt.y };
        draw_aRect(null, null, lastRect);
    }
}

// ExtraC: Add UI somewhere that give coordinates of where
// mouse is currently, regards of being clicked.



/*
 *  Draws a engineering like graph paper on the canvas
 *  with the given color and unit parameters. This function
 *  defaults to the globally defined variables for color and units.
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

    ctx.restore();
}
/*
    Simple helper function to draw a stroked rectangle
*/
function draw_aRect(c_fill, c_stroke, aRect) {
    ctx.save();

    ctx.fillStyle = c_fill || REC_FILL_COLOR;
    ctx.strokeStyle = c_stroke || REC_STROKE_COLOR;
    ctx.strokeRect(aRect.x, aRect.y, aRect.w, aRect.h);
    ctx.fillRect(aRect.x, aRect.y, aRect.w, aRect.h);

    ctx.restore();
}

/* Some Setup functions I use to make the page look nice-er */

/* Some setup for the Canvas */
window.onresize = do_resize;
function do_resize() {
    lastImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth - 25;
    canvas.height = window.innerHeight - 15;
    ctx.putImageData(lastImg, 0, 0);
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
