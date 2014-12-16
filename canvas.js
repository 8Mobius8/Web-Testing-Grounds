/*
    Mark Odell : renderer Demos : WebGL
*/
var renderer, scene, cam,
    cube, tetra, sphere, plane,
    dlight, amblight, ptLgtObj,
    time;
    
// Setup function for loading the page
var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;

window.onload = function () {
  
  setupView();

  // Initalize and create all objects
  makeObjects();  

  var axis = new THREE.AxisHelper(); 

  // Add lights
  scene.add(dlight);
  scene.add(amblight);
  scene.add(hlight);

  // Add geometric objs
  scene.add(cube);
  scene.add(tetra)
  scene.add(sphere);
  scene.add(plane);

  // Add controls
  var controls = new THREE.OrbitControls(cam);
  startDrawing();
}

/*--------   Functional Code   ---------*/

function setupView() {
  // Creates a new camera matrix and world coordnates based on view of camera
  // aka defines cliping space
  scene = new THREE.Scene();
  cam = new THREE.PerspectiveCamera(75, WIDTH/HEIGHT, 1, 1000)

  cam.lookAt(new THREE.Vector3(0,0,-5));
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH - 20, HEIGHT - 20);
  document.body.appendChild( renderer.domElement );

  // Shadow casting
  renderer.shadowMapEnabled = true;

  // Listen for resizing window and adjust view
  window.addEventListener('resize', onWindowResize, false);
}

function startDrawing() {
  cam.position.set(5, 5, 5);


  cube.position.set(2, 0, 2);
  tetra.position.set(-2, 0, 2);
  sphere.position.set(0, 0, -2);

  var render = function () {
    time = 0.0001 * Date.now();

    cam.lookAt({x:0, y:0, z:0});
    // cam.position.z = Math.sin(time) * 10;
    // cam.position.x = Math.cos(time) * 10;

    requestAnimationFrame( render );
    cube.rotation.x += 0.01;
    tetra.rotation.x += 0.01;
    sphere.rotation.x += 0.01;

    renderer.render(scene, cam);
  };

  render();
}

function makeObjects() {
  
  // Cube
  var geometry = new THREE.BoxGeometry(1,1,1);

  var material = new THREE.MeshLambertMaterial( {
    color: 0xff0000,

    shading: THREE.SmoothShading,
    blending: THREE.NormalBlending,
  } );

  cube = new THREE.Mesh(geometry, material);

  // Tetrahedron
  geometry = new THREE.TetrahedronGeometry(1, 0);

  material = new THREE.MeshBasicMaterial( {
    color: 0xff0000,
    ambient: 0x00ff00,
    emissive: 0x0000ff,
    opacity: 1.0,

    reflectivity: 0.5,
    refractionRatio: 1.0,

    shading: THREE.SmoothShading,
    blending: THREE.NormalBlending,

    wireframe: false,

    vertexColors: THREE.FaceColors
    } );

  tetra = new THREE.Mesh(geometry, material);

  // Sphere
  geometry = new THREE.SphereGeometry(1, 32, 32);

  material = new THREE.MeshPhongMaterial( {
      shading: THREE.SmoothShading,
      blending: THREE.NormalBlending,

      reflectivity: 10.0,
      wireframe: false,
    } );
  material.shininess = 10000;
  sphere = new THREE.Mesh(geometry, material);

  // Plain
  geometry = new THREE.PlaneGeometry(10, 10, 32, 32);

  material = new THREE.MeshLambertMaterial({
    color: 0x444444,
    shading: THREE.SmoothShading,
    blending: THREE.NormalBlending,
  });

  plane = new THREE.Mesh(geometry, material);
  plane.position.y = -1;
  plane.rotation.x = -Math.PI / 2;

  // Lights
  dlight = new THREE.SpotLight(0xffffff, 0.5);
  dlight.position.set( 0, 5, 5 );
  dlight.castShadow = true;
  dlight.shadowMapWidth = 1024;
  dlight.shadowMapHeight = 1024;
  dlight.shadowCameraNear = 1;
  dlight.shadowCameraFar = 20;
  dlight.shadowCameraFov = 75;

  amblight = new THREE.AmbientLight(0x404040); // soft white light

  hlight = new THREE.HemisphereLight(0xff0000, 0x00ff00, 1.0);

  // Shadows
  dlight.castShadow = true;
  dlight.shadowCameraVisible = true;

  tetra.castShadow = true;
  cube.castShadow = true;
  sphere.castShadow = true;
  
  // Plane is only thing that should have shadows on it
  // for this assignment.
  plane.receiveShadow = true; 
}
/*-------- END Functional Code ---------*/

function onWindowResize() {

  cam.aspect = window.innerWidth / window.innerHeight;
  cam.updateProjectionMatrix();

  renderer.setSize( window.innerWidth - 20, window.innerHeight - 20);

}
