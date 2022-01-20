import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer,
        createGroundPlane,
        createLightSphere,
        onWindowResize,
        degreesToRadians} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information  var renderer = initRenderer();    // View function in util/utils
var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(20.0, 20.0, 30.0);
  camera.up.set( 0, 1, 0 );

var ambientLight = new THREE.AmbientLight("rgb(100, 100, 100)");
scene.add(ambientLight);

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 1.5 );
  axesHelper.visible = false;
scene.add( axesHelper );

//-- Scene Objects -----------------------------------------------------------
// Cube
var cubeSideGeometry = new THREE.PlaneGeometry(10, 10);
var cubeSideMaterial = new THREE.MeshBasicMaterial();
    cubeSideMaterial.side = THREE.DoubleSide;
var cubeSide1 = new THREE.Mesh(cubeSideGeometry, cubeSideMaterial);
cubeSide1.rotateY(degreesToRadians(90));
cubeSide1.position.set(5.0, 0.0, 0.0);

var cubeSide2 = new THREE.Mesh(cubeSideGeometry, cubeSideMaterial);
cubeSide2.rotateY(degreesToRadians(90));
cubeSide2.position.set(-5.0, 0.0, 0.0);

var cubeSide3 = new THREE.Mesh(cubeSideGeometry, cubeSideMaterial);
cubeSide3.rotateX(degreesToRadians(90));
cubeSide3.position.set(0.0, 5.0, 0.0);

var cubeSide4 = new THREE.Mesh(cubeSideGeometry, cubeSideMaterial);
cubeSide4.rotateX(degreesToRadians(90));
cubeSide4.position.set(0.0, -5.0, 0.0);

var cubeSide5 = new THREE.Mesh(cubeSideGeometry, cubeSideMaterial);
    cubeSide5.position.set(0.0, 0.0, -5.0);

scene.add(cubeSide1);
scene.add(cubeSide2);
scene.add(cubeSide3);
scene.add(cubeSide4);
scene.add(cubeSide5);

//----------------------------------------------------------------------------
//-- Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();
var marble  = textureLoader.load('../assets/textures/marble.png');

// Apply texture to the 'map' property of the respective materials' objects
cubeSide1.material.map = marble;
cubeSide2.material.map = marble;
cubeSide3.material.map = marble;
cubeSide4.material.map = marble;
cubeSide5.material.map = marble;

render();

function render()
{
  stats.update();
  trackballControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
