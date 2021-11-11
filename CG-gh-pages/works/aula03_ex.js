import * as THREE from "../build/three.module.js";
import {initRenderer,
        createGroundPlane,
        onWindowResize,
        degreesToRadians,
        createGroundPlaneWired} from "../libs/util/util.js";

var scene = new THREE.Scene(); // Create main scene
var renderer = initRenderer(); // View function in util/utils

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

// Main camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0, 5, 0);
  camera.up.set( 0, 10, 0 );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlaneWired(400, 400, 80, 80); // width and height
//groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Create helper for the virtual camera
const cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

updateCamera();
render();

document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "Space":
      camera.position.z -= 1;
      break;
    case "ArrowLeft":
      cameraHolder.rotateY(degreesToRadians(1));
      break;
    case "ArrowRight":
      cameraHolder.rotateY(degreesToRadians(-1));
      break;
    case "ArrowUp":
      cameraHolder.rotateX(degreesToRadians(-1));
      break;
    case "ArrowDown":
      cameraHolder.rotateX(degreesToRadians(1));
      break;
    case "Comma":
      cameraHolder.rotateZ(degreesToRadians(1));
      break;
    case "Period":
      cameraHolder.rotateZ(degreesToRadians(-1));
      break;
    default:
      break;
  }
});

function updateCamera() {}

function controlledRender() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main viewport
  renderer.setViewport(0, 0, width, height); // Reset viewport
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  // renderer.setClearColor("rgb(80, 70, 170)");
  renderer.clear(); // Clean the window
  renderer.render(scene, camera);
}

function render() {
  controlledRender();
  requestAnimationFrame(render);

}