/*
	Mark Odell : Drawing Interactive Triangles
    The purpose of this assignment is to be able to interactively draw rectangle shapes with rubberbanding onto a "graph paper" canvas. We use the term rubberbanding for when refering to when a mouse click is up or down.
*/
var canvas, ctx;
var FULLSCREEN = false;
var REC_COLOR, GRAPH_COLOR; 

// Need two listeners: Mouse Down, Mouse Up
// Mouse Down()
//      Save point where mouse is currently
// Mouse Up()
//      Save point where mouse is currently
//      Use previously saved point and poiny from Mouse Down to draw a rect

// ExtraC: Add UI somewhere that give coordinates of where
// mouse is currently, regards of being clicked.


/* Some Setup functions I use to make the page look nice-er */
// Setup function for loading the page
window.onload = function () {
	initalize();
};

/* Some setup for the Canvas */
window.onresize = resizeCanvas;
function resizeCanvas() {
	canvas.width = window.innerWidth - 25;
    canvas.height = window.innerHeight - 15;
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
    resizeCanvas();
}
