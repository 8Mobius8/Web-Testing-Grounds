/*
	Mark Odell : Simple Canvas Starter js
*/
var canvas, ctx;
var FULLSCREEN = false;

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
