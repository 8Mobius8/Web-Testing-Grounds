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
      wireframe: true
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
       -1,  // Left bound
        1,  // Right bound
        1,  // Top bound
       -1,  // Bottom Bound
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
      new THREE.Vector3()
    );
}

function createIndices(gl) {
}

function startDrawing() {
  cam.position.z = 5;
  var render = function () {
    requestAnimationFrame( render );

    //cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    canvas.render(scene, cam);
  };

  render();
}

/*-------- END Functional Code ---------*/
