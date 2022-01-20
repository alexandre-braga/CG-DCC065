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
  camera.position.set(30.0, 30.0, 30.0);
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
var cylinderSideGeometry = new THREE.CylinderGeometry(5.0, 5.0, 10, 32, 8, true);
var cylinderMaterial = new THREE.MeshBasicMaterial();
    cylinderMaterial.side = THREE.DoubleSide;
var cylinder = new THREE.Mesh(cylinderSideGeometry, cylinderMaterial);
cylinder.position.set(0.0, 5.0, 0.0);

var cylinderTopGeometry = new THREE.CircleGeometry(5.0, 32);
var cylinderTopMaterial = new THREE.MeshBasicMaterial();
    cylinderTopMaterial.side = THREE.DoubleSide;

var top1 = new THREE.Mesh(cylinderTopGeometry, cylinderTopMaterial);
top1.rotateX(degreesToRadians(90));
top1.position.set(0.0, 10.0, 0.0);

var top2 = new THREE.Mesh(cylinderTopGeometry, cylinderTopMaterial);
top2.rotateX(degreesToRadians(90));
top2.position.set(0.0, 0.0, 0.0);

scene.add(cylinder);
scene.add(top1);
scene.add(top2);


//----------------------------------------------------------------------------
//-- Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader();
  var wood  = textureLoader.load('../assets/textures/wood.png');
var woodtop  = textureLoader.load('../assets/textures/woodtop.png');

// Apply texture to the 'map' property of the respective materials' objects
cylinder.material.map = wood;
top1.material.map = woodtop;
top2.material.map = woodtop;

render();

function render()
{
  stats.update();
  trackballControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
