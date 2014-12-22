/*
	Mark Odell CS 116 : ColorChart Assignment

	In this assignment we used the HTML element <canvas> to render
	a color 'cube' using standard canvas drawing and render method
	calls: fill(), openPath(), closePath(), arc() etc. The goal was to
	render a cube overlayed circles of a gradient of the primary colors.
	
	I used global variables to contain common values: angles in radians, 
	and the unit vectors in those directions. In addition, I have 
	several helper functions that determine the shape of the chart. You
	should be able to change these angles to get a different regular shape.
	
*/

var canvas, ctx;
/*
	Unit Vectors for directions of IsoCube Edges
	starting from top-right most corner when rendered
*/
var R_ANGLES = [5*Math.PI/6, 7*Math.PI/6, 3*Math.PI/2, 11*Math.PI/6, Math.PI/6, Math.PI/2];

var UNIT_VECTORS = R_ANGLES.map(function(element){
	return pointFromAngle(null, 1, element);
});

window.onload = function () {
	// Setup function
	ColorChart();
};
window.onResize = function () {
	ctx.width = window.innerWidth;
	ctx.height = window.innerHeight;
}; 

/*----- Main function -------*/
function ColorChart() {
	var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
    	ctx = canvas.getContext('2d');
    	canvas.style.backgroundColor = 'grey';

    } else {
    	alert('Canvas could not be found by ID:' + canvas);
    	return;
    }
	var p = { x: canvas.height/2,
			  y: canvas.width/2 }; // Center of graph since is html attr
    
	var div = 5;
    var size = 200; // Change this to change scale of graph
    
    // Found 1/5 to be a nice ratio for the background
    fill_isoCube(p, size-size/5, '#000');
    // Calls function that draws colored circles
    fill_Shell(p, size/(div*2), div);
}
/*------ End of Main --------*/

/* Overlays Circles */
function fill_Shell(centerPt, r, shells){
	var i, j, k, lum, hue, p = {x:0, y:0};

	fill_circle(centerPt, r, '#fff');
	for(i = 0; i < shells; i++){
		lum = Math.floor(100-(i/shells*50));
		for(j=0; j < i*6; j++){
			p = pointFromAngle(centerPt, 2*r*i, R_ANGLES[(j+2)%6]);
			ctx.fillStyle = hslStr(360-60*j, 100, lum);
			p_circle(p, r);
			ctx.fill();
			for(k=0; k <= i-1; k++){
				p_circle(pointFromAngle(p, 2*r*(k+1), R_ANGLES[(j+4)%6]), r);
				ctx.fillStyle = hslStr(360-(60*j+(60/i)*(k+1)), 100, lum);
				ctx.fill();
			}
		}
	}
}

/* 
   ------- HELPER FUNCS -------
*/

/* Helper Path functions */
function p_circle(p, r) {
	ctx.beginPath();
	ctx.moveTo(p.x, p.y);
	ctx.arc(p.x, p.y, r, 0, Math.PI*2);
	ctx.closePath();
}
function p_isoCube(p, sidel) {
	ctx.beginPath();
	var i, q = {x:p.x + sidel*UNIT_VECTORS[0].x, y:p.y + sidel*UNIT_VECTORS[0].y};

	ctx.moveTo(q.x, q.y);
	for(i=0; i<UNIT_VECTORS.length; i++) {
		q.x = p.x + sidel*UNIT_VECTORS[i].x;
		q.y = p.y + sidel*UNIT_VECTORS[i].y;
		ctx.lineTo(q.x, q.y);
	}

	ctx.closePath();
}
function p_circle_inDirection(p, r, angle) {
	var c = pointFromAngle(p, 2*r, angle);
	p_circle(c, r);
}

/* --- Helpers for Drawing Shapes --- */
function fill_circle(p, r, color) {
	ctx.fillStyle = color;
	p_circle(p, r);
	ctx.fill();
}
function fill_isoCube(p, length, color){
	ctx.fillStyle = color;
	p_isoCube(p, length);
	ctx.fill();
}

/* --- Math Helpers --- */
function pointFromAngle(p, r, angle){
	var c = {x:0,y:0};
	c.x = r*Math.cos(angle);
	c.y = r*Math.sin(angle);
	
	if(p != null) {
		c.x += p.x;
		c.y += p.y;
	}
	return c;
}
function add(a, b){
	c = {
		x:(a.x + b.x),
		y:(a.y + b.y)
	}
	return c;
}
/* --- Color String Builders --- */
function hslStr(hue, sat, lum){
	return 'hsl('+hue+','+sat+'%,'+lum+'%)';
}
function rgbStr(r, g, b) {
	return 'rgb('+ r +','+ g +','+ b +')';
}
