/*
    Mark Odell : Canvas Demos : WebGL
*/
var canvas, scene, cam;
var cube;
    
// Setup function for loading the page
var WIDTH = window.innerHeight, HEIGHT = window.innerHeight;

window.onload = function () {
  
  setupView();

  var geometry = createVertices();

  var material = new THREE.MeshBasicMaterial( 
    { color: 0x00ff00,
      wireframe: false
     } );
  cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  startDrawing();
}

/*--------   Functional Code   ---------*/

function setupView() {
    // Creates a new camera matrix and world coordnates based on view of camera
  // aka defines cliping space
  scene = new THREE.Scene();
  cam = new THREE.OrthographicCamera(
       -2,  // Left bound
        2,  // Right bound
        2,  // Top bound
       -2,  // Bottom Bound
        0.1, // Near bound
        10); // Far bound
  //cam.lookAt(new THREE.Vector3(0,0,-5));
  canvas = new THREE.WebGLRenderer();
  canvas.setSize(WIDTH - 20, HEIGHT - 20);
  document.body.appendChild( canvas.domElement );
}

function createVertices() {
  var geo = new THREE.Geometry();

  geo.vertices.push(
    // Red Face 
    new THREE.Vector3( 0.7,  0.7,  0.7), // 0
    new THREE.Vector3(-0.7,  0.7,  0.7), // 1
    new THREE.Vector3(-0.7, -0.7,  0.7), // 2
    new THREE.Vector3( 0.7, -0.7,  0.7), // 3
    // Blue Face
    new THREE.Vector3(-0.7,  0.7,  0.7), // 1
    new THREE.Vector3(-0.7,  0.7, -0.7), // 4
    new THREE.Vector3(-0.7, -0.7, -0.7), // 7
    new THREE.Vector3(-0.7, -0.7,  0.7), // 2
    // Orange Face
    new THREE.Vector3(-0.7,  0.7, -0.7), // 4
    new THREE.Vector3( 0.7,  0.7, -0.7), // 5
    new THREE.Vector3( 0.7, -0.7, -0.7), // 6
    new THREE.Vector3(-0.7, -0.7, -0.7), // 7
    // Green Face
    new THREE.Vector3( 0.7,  0.7, -0.7), // 5
    new THREE.Vector3( 0.7,  0.7,  0.7), // 0
    new THREE.Vector3( 0.7, -0.7,  0.7), // 3
    new THREE.Vector3( 0.7, -0.7, -0.7), // 6
    // White Face
    new THREE.Vector3( 0.7,  0.7, -0.7), // 5
    new THREE.Vector3(-0.7,  0.7, -0.7), // 4
    new THREE.Vector3(-0.7,  0.7,  0.7), // 1
    new THREE.Vector3( 0.7,  0.7,  0.7), // 0
    // Yellow Face
    new THREE.Vector3( 0.7, -0.7,  0.7), // 3
    new THREE.Vector3(-0.7, -0.7,  0.7), // 2
    new THREE.Vector3(-0.7, -0.7, -0.7), // 7
    new THREE.Vector3( 0.7, -0.7, -0.7)  // 6
  );

  geo.computeBoundingSphere();
  return geo;
}

function createIndices(gl) {
}

function startDrawing() {
  cam.position.z = 5;
  var render = function () {
    requestAnimationFrame( render );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    canvas.render(scene, cam);
  };

  render();
}

/*-------- END Functional Code ---------*/
