/*
    Mark Odell : Canvas Demos : WebGL
*/
var canvas, gl;
    
// Setup function for loading the page
window.onload = function () {
  init_canvas();
  //init_Listners();

  var nPoints = createVertices(gl);
  if(!nPoints){
    console.log("Unable to create points");
  }

  var nIndices = createIndices(gl);
  if (!nIndices) {
    alert("Unable to create points.");
    return;
  }
  
  // Corrects depth rendering issues
  gl.enable(gl.DEPTH_TEST);

  var animate = function() {
    setupView(gl);
    draw_Frame(gl, nPoints, nFaces, nVtxsFace);
    window.requestAnimationFrame(animate);
  }

  animate();
}

/*--------   Functional Code   ---------*/
// Program vars
var POINT_SIZE = 30.0,
    nFaces = 6,
    nVtxsFace = 4;

var vertexShaderCode = 
    'attribute vec4 a_Position; \n' +
    'uniform mat4 u_MVPMatrix; \n' +
    'attribute float a_PointSize; \n' +
    'attribute vec4 a_Color; \n' +
    'varying vec4 v_Color; \n' +
    'void main() { \n' +
    '  gl_Position = u_MVPMatrix * a_Position; \n' +
    '  gl_PointSize = a_PointSize; \n' +
    '  v_Color = a_Color; \n' +
    '} \n';

var fragmentShaderCode = 
    'precision mediump float; \n' +
    'varying vec4 v_Color; \n' +
    'void main() { \n' +
    '  gl_FragColor = v_Color; \n' +
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

function createVertices(gl) {
  
  // define a block of binary data interpreted as Float32Array
  
  var vertexPositionsColors = new Float32Array([
    // Red Face
     0.7,  0.7,  0.7,    1.0, 0.0, 0.0, // 0
    -0.7,  0.7,  0.7,    1.0, 0.0, 0.0, // 1
    -0.7, -0.7,  0.7,    1.0, 0.0, 0.0, // 2
     0.7, -0.7,  0.7,    1.0, 0.0, 0.0, // 3
    // Blue Face
    -0.7,  0.7,  0.7,    0.0, 0.0, 1.0, // 1
    -0.7,  0.7, -0.7,    0.0, 0.0, 1.0, // 4
    -0.7, -0.7, -0.7,    0.0, 0.0, 1.0, // 7
    -0.7, -0.7,  0.7,    0.0, 0.0, 1.0, // 2
    // Orange Face
    -0.7,  0.7, -0.7,    1.0, 0.64, 0.0, // 4
     0.7,  0.7, -0.7,    1.0, 0.64, 0.0, // 5
     0.7, -0.7, -0.7,    1.0, 0.64, 0.0, // 6
    -0.7, -0.7, -0.7,    1.0, 0.64, 0.0, // 7
    // Green Face
     0.7,  0.7, -0.7,    0.0, 1.0, 0.0, // 5
     0.7,  0.7,  0.7,    0.0, 1.0, 0.0, // 0
     0.7, -0.7,  0.7,    0.0, 1.0, 0.0, // 3
     0.7, -0.7, -0.7,    0.0, 1.0, 0.0, // 6
    // White Face
     0.7,  0.7, -0.7,    1.0, 1.0, 1.0, // 5
    -0.7,  0.7, -0.7,    1.0, 1.0, 1.0, // 4
    -0.7,  0.7,  0.7,    1.0, 1.0, 1.0, // 1
     0.7,  0.7,  0.7,    1.0, 1.0, 1.0, // 0
    // Yellow Face
     0.7, -0.7,  0.7,    1.0, 0.0, 1.0, // 3
    -0.7, -0.7,  0.7,    1.0, 0.0, 1.0, // 2
    -0.7, -0.7, -0.7,    1.0, 0.0, 1.0, // 7
     0.7, -0.7, -0.7,    1.0, 0.0, 1.0, // 6
  ]);

  var pCoords = 3,  // how many position coords per vertex
      cCoords = 3,  // how many color coords per vertex
      vertexWidth = pCoords + cCoords;

  var floatSize = vertexPositionsColors.BYTES_PER_ELEMENT;
  var stride = vertexWidth * floatSize,   // how many bytes per vertex
      positionOffset = 0 * floatSize,     // starting byte of positions
      colorOffset = pCoords * floatSize;  // starting byte of colors
  
  // create a buffer for the vertex data
  var vBuffer = gl.createBuffer();
  if (!vBuffer) {
    alert("Unable to create vertex buffer.");
    return 0;
  }
  
  // make vBuffer the "current" buffer and copy data into it
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexPositionsColors, gl.STATIC_DRAW);
  
  // tell the vertex shader how to determine positions
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, pCoords, gl.FLOAT, false, 
                         stride, positionOffset);
  gl.enableVertexAttribArray(a_Position);

  // tell the vertex shader how to determine colors
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, cCoords, gl.FLOAT, false,
                         stride, colorOffset);
  gl.enableVertexAttribArray(a_Color);
  
  // tell the vertex shader about the point size
  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  gl.vertexAttrib1f(a_PointSize, 10.0);

  // return the number of vertices
  return vertexPositionsColors.length / vertexWidth;
}

function createIndices(gl) {
  var indices = new Uint8Array([
    0, 1, 2, 3,
    4, 5, 6, 7,
    8, 9, 10, 11,
    12, 13, 14, 15,
    16, 17, 18, 19,
    20, 21, 22, 23
  ]);
  
  // create a buffer for the indices
  var iBuffer = gl.createBuffer();
  if (!iBuffer) {
    alert("Unable to create index buffer.");
    return 0;
  }
  
  // make iBuffer the "current" buffer and copy data into it
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
  // return the number of vertices
  return indices.length;
}

function draw_Frame(gl, nPoints, nFaces, nVtxsFace) {
  
  // Clear and draw the points
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //gl.drawArrays(gl.POINTS, 0, nPoints);

    // draw the face loops
  for (var face = 0; face < nFaces; face++) {
    gl.drawElements(gl.TRIANGLE_FAN, nVtxsFace, gl.UNSIGNED_BYTE, face * nVtxsFace);
  } 
}

/*-------- END Functional Code ---------*/

/*--   Init functions for Canvas   --*/

function init_canvas(){
  canvas = document.getElementById("canvas");
  var d = 
  (window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth; 
  canvas.width = canvas.height = d - 20;
  gl = canvas.getContext('webgl');
  if(!gl) {
      alert('Canvas could not be found by ID:' + canvas);
      return;
  }

  // initialize the shaders
  if (!initShaders(gl, vertexShaderCode, fragmentShaderCode)) {
      alert('Cannot initialize the shaders.');
      return;
  }
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
