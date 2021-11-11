import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer,
        initCamera,
        InfoBox,
        onWindowResize,
        degreesToRadians,
        createGroundPlaneWired} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils

var camera = initCamera(new THREE.Vector3(0, 0, 2)); // Init camera in this position
var cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
cameraHolder.position.set(0, 20, 0);
scene.add(cameraHolder);

scene.add(new THREE.HemisphereLight());
// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
//var trackballControls = new TrackballControls(camera, renderer.domElement );
var direction = new THREE.Vector3;

function keyboardUpdate() {
    keyboard.update();

    if (keyboard.pressed("K")) {
        cameraHolder.translateZ(-5);
    }

    if (keyboard.pressed("A")) {
        cameraHolder.rotateY(degreesToRadians(2));
    }
    else if (keyboard.pressed("D")) {
        cameraHolder.rotateY(degreesToRadians(-2));
    }

    if (keyboard.pressed("W")) {
        cameraHolder.rotateX(degreesToRadians(2));
    }
    else if (keyboard.pressed("S")) {
        cameraHolder.rotateX(degreesToRadians(-2));
    }

    if (keyboard.pressed("J")) {
        cameraHolder.rotateZ(degreesToRadians(2));
    }
    else if (keyboard.pressed("L")) {
        cameraHolder.rotateZ(degreesToRadians(-2));
    }
}

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var plane = createGroundPlaneWired(1500, 1500, 80, 80);
// add the plane to the scene
scene.add(plane);

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Aula 03");
  controls.addParagraph();
  controls.add("Use keyboard to interact:");
  controls.add("* Arrow keys to rotate");
  controls.add("* ,/. to turn left/right");
  controls.add("* Space to go backwards.");
  controls.show();

render();
function render()
{
  stats.update(); // Update FPS
  requestAnimationFrame(render);
  //trackballControls.update();
  keyboardUpdate();
  renderer.render(scene, camera) // Render scene
}