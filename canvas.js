/*
    Mark Odell : Canvas Demos : WebGL
*/
var canvas, gl;
    
// Setup function for loading the page
window.onload = function () {
  init_canvas();
  init_Listners();

  var nPoints = createVerticesBuffers(gl);
  if(!nPoints){
    console.log("Unable to create points");
  }

  var nIndices = createIndicesBuffers(gl);
  if (!nIndices) {
    alert("Unable to create points.");
    return;
  }

  var nFaces = 6,
      nVtxsFace = 4;

  var animate = function() {
    setupView(gl);
    drawFaceLoops(gl, nPoints, nFaces, nVtxsFace);
    window.requestAnimationFrame(animate);
  }

  animate();
}

/*--------   Functional Code   ---------*/
// Program vars
var POINT_SIZE = 10.0,
    nFaces = 6,
    nVtxsFace = 4;

var zehCube = new Float32Array([
  //positions and colors interleaved
   0.7,  0.7,  0.7,    1.0, 1.0, 1.0,
  -0.7,  0.7,  0.7,    0.0, 1.0, 1.0,
  -0.7, -0.7,  0.7,    0.0, 0.0, 1.0,
   0.7, -0.7,  0.7,    1.0, 0.0, 1.0,
  -0.7,  0.7, -0.7,    0.0, 1.0, 0.0,
   0.7,  0.7, -0.7,    1.0, 1.0, 0.0,
   0.7, -0.7, -0.7,    1.0, 0.0, 0.0,
  -0.7, -0.7, -0.7,    0.0, 0.0, 0.0
]);
var zehCube_pWidth = 3,  // how many position coords per vertex
    zehCube_cWidth = 3,  // how many color coords per vertex
    zehCube_vertexWidth = zehCube_pWidth + zehCube_cWidth;

var zehCube_ix = new Uint8Array([
  0, 1, 2, 3,
  4, 5, 6, 7,
  5, 0, 3, 6,
  1, 4, 7, 2,
  5, 4, 1, 0,
  3, 2, 7, 6
]);

// Shader vars
var a_Position, a_PointSize, // Vertex
    a_Color;             // Fragment

var vertexShaderCode = 
    'attribute vec4 a_Position; \n' +
    'attribute float a_PointSize; \n' +
    'void main() { \n' +
    '  gl_Position = a_Position; \n' + 
    '  gl_PointSize = a_PointSize; \n' +
    '} \n';

var fragmentShaderCode = 
    'precision mediump float; \n' +
    'uniform vec4 a_Color; \n' +
    'void main() { \n' +
    '  gl_FragColor = a_Color; \n' +
    '} \n';

function setupView(gl) {
  var angleStep = 45.0; // rotation angle/sec
  
  if(!setupView.time) { // initalize static vars
    setupView.angle = 0.0;
    setupView.time = Date.now();
  }

  // Update time
  var now = Date.now();
  var elapsed = now - setupView.time;
  setupView.time = now;

  // Update the angle adjusted by elapsed time
  setupView.angle += (angleStep * elapsed) / 1000.0;
  setupView.angle %= 360;

  // Using gl-matrix.js library (http://glmatrix.net)

  var mvpMatrix = mat4.create();
  
  var modelMatrix = mat4.create();
  var thetaDegrees = setupView.angle,  // 10,
      theta = glMatrix.toRadian(thetaDegrees);
  mat4.rotateX(modelMatrix, mat4.create(), theta);
  mat4.rotateY(modelMatrix, modelMatrix, theta);
  mat4.multiply(mvpMatrix, modelMatrix, mvpMatrix);
  
  var viewMatrix = mat4.create();
  var eye = [0.2, -0.2, 0.5],
      center = [0.0, 0.0, 0.0],
      up = [0.0, 1.0, 0.0];
  mat4.lookAt(viewMatrix, eye, center, up);
  mat4.multiply(mvpMatrix, viewMatrix, mvpMatrix);

  var projectionMatrix = mat4.create();
  var left = -3.0,
      right = 3.0,
      bottom = -3.0,
      top = 3.0,
      near = -5.0,
      far = 1000.0;
  mat4.ortho(projectionMatrix, left, right, bottom, top, near, far);
  mat4.multiply(mvpMatrix, projectionMatrix, mvpMatrix);
  
  // set the transform matrix in the vertex shader
  var u_MVPMatrix = gl.getUniformLocation(gl.program, 'u_MVPMatrix');
  gl.uniformMatrix4fv(u_MVPMatrix, false, mvpMatrix);
}

function createVerticesBuffers(gl, vxs){

  // Create a vertex buffer
  var vBuffer = gl.createBuffer();
  if(!vBuffer) {
    console.log("Cannot create vertex buffer but carrying on.\n");
  }

  // Binding buffer sets it to be used in next draw?
  // Once a buffer is bound and cannot be bound again.
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, zehCube, gl.STATIC_DRAW);

  var fltsize = zehCube.BYTES_PER_ELEMENT;
  var stride         = zehCube_vertexWidth * fltsize,
      positionOffset = 0, //* fltfize,
      colorOffset    = zehCube_pWidth * fltsize;
  
  // How to draw vertices
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, zehCube_pWidth, gl.FLOAT, false, 
                         stride, positionOffset);
  gl.enableVertexAttribArray(a_Position);

  // How to draw Color Data
  a_Color = gl.getUniformLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, zehCube_cWidth, gl.FLOAT, false,
                         stride, colorOffset);
  gl.enableVertexAttribArray(a_Color);

  // Size of the vertices drawn
  a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  gl.vertexAttrib1f(a_PointSize, POINT_SIZE);

  // Numbah of vertices
  return zehCube.length / zehCube_vertexWidth;
}

function createIndicesBuffers(gl, ins){
  var iBuffer = gl.createBuffer();
  if (!iBuffer) {
    alert("Unable to create index buffer.");
    return 0;
  }
  
  // make iBuffer the "current" buffer and copy data into it
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, zehCube_ix, gl.STATIC_DRAW);
  
  // return the number of vertices (as in the array of indices)
  return zehCube_ix.length;
}

function draw_Frame(gl, nPoints, nFaces, nVtxsFace) {
  // Clear and draw the points
  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, nPoints);

    // draw the face loops
  for (var face = 0; face < nFaces; face++) {
    gl.drawElements(gl.LINE_LOOP, nVtxsFace, gl.UNSIGNED_BYTE, face * nVtxsFace);
  } 
}

function init_Listners() {
  canvas.addEventListener("mousedown", do_MouseDown);
  canvas.addEventListener("mouseup", do_MouseUp);
  canvas.addEventListener("mousemove", do_MouseMove);
  document.getElementById("erase").onclick = eraseAll;
} 
// vvv Listeners vvv \\
function do_MouseDown(event) {

}

function do_MouseMove(event) {

}

function do_MouseUp(event) {
  
}
// ^^^ Listeners ^^^ \\


/*-------- END Functional Code ---------*/

function randomColor() {
  var aClr = Math.random();
  console.log(aClr);
  return aClr;
}

function getPtMouseEvent(event) {
  var mouseX = event.clientX - canvas.offsetLeft,
      mouseY = event.clientY - canvas.offsetTop;
  
  var glPt = {x:(mouseX - canvas.width/2) / (canvas.width/2), 
              y:(canvas.height/2 - mouseY) / (canvas.height/2)};
  return glPt;
}

function eraseAll() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  leafCollection = [];
}

/*--   Init functions for Canvas   --*/

function init_canvas(){
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
        gl = canvas.getContext('webgl');
    if(!gl) {
        alert('Canvas could not be found by ID:' + canvas);
        return;
    }
    
    // specify a clear value for color buffer
    // (note that GL colors are 0.0 to 1.0, not 0 to 255)
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // black

    // clear the color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);

    // initialize the shaders
    if (!initShaders(gl, vertexShaderCode, fragmentShaderCode)) {
        alert('Cannot initialize the shaders.');
        return;
    }

    gl.drawArrays(gl.POINTS, 0, 1);
}
/*-- END Init functions for Canvas --*/

// Init shaders -----------------------------------------------
// curtosity of Jim Mildrew, much praise

function initShaders(gl, vshader, fshader) {
  
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    alert('Failed to create program');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;
  return true;
}


function createProgram(gl, vshader, fshader) {
  
  // Create and compile the shader objects
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) return null;

  // Create a program object
  var program = gl.createProgram();
  if (!program) return null;

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    alert('Failed to link program: ' + gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  
  return program;
}


function createShader(gl, type, source) {
  
  // Create a shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    alert('Unable to create shader');
    return null;
  }

  // Set the shader source and compile it
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    alert('Failed to compile shader: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
