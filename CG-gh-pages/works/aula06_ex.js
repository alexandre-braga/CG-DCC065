import * as THREE from "../build/three.module.js";
import Stats from "../build/jsm/libs/stats.module.js";
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import {
  initRenderer,
  initCamera,
  InfoBox,
  onWindowResize,
  initDefaultSpotlight,
  initDefaultBasicLight,
  degreesToRadians,
} from "../libs/util/util.js";
import { Turbina } from "./aula06_turbina.js";
import { Car } from "./Car.js";
import KeyboardState from "../libs/util/KeyboardState.js";

const loader = new THREE.TextureLoader();
const skyTexture = loader.load( 'texture/sky.jpg' );
const grassTexture = loader.load( 'texture/grass.jpg' );
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set( 1000, 1000 );
grassTexture.anisotropy = 16;
var grassMaterial = new THREE.MeshStandardMaterial( { map: grassTexture } );

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
scene.background = skyTexture;
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position
camera.position.set(170, 80, 170)
camera.up.set( 0, 10, 0 );
camera.near = 10;
camera.far = 5000;

var plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 10000, 10000 ), grassMaterial );
plane.position.y = 0.0;
plane.rotation.x = - Math.PI / 2;
plane.position.y = 0.0;
scene.add(plane);

var trackballControls = new TrackballControls(camera, renderer.domElement);

initDefaultBasicLight(scene, true);

var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

var speed = 0.05;
var animationOn = true; // control if animation is on or of
var turboGlobal = 0.0;

function SpinBlades()
{
  if(animationOn)
  {
    eolicTurbine.defaultUpdate(speed + turboGlobal);
  }
}

var eolicTurbine = new Turbina();
eolicTurbine.position.set(0.0, 0.0, 1.0);
scene.add(eolicTurbine);

var keyboard = new KeyboardState();
function keyboardUpdate() {
  keyboard.update();

  if (keyboard.down("0")){
    turboGlobal = 50.0;
  }
}

// Listen window size changes
window.addEventListener("resize", function () { onWindowResize(camera, renderer); }, false);

function buildInterface()
{
  var controls = new function ()
  {
    this.onChangeAnimation = function(){
      animationOn = !animationOn;
    };
    this.speed = 0.05;

    this.changeSpeed = function(){
      speed = this.speed;
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");
  gui.add(controls, 'speed', 0.00, 5.0)
    .onChange(function(e) { controls.changeSpeed() })
    .name("Change Speed");
}

buildInterface();
render();
function render() {
  keyboardUpdate();
  stats.update(); // Update FPS
  SpinBlades();
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera); // Render scene
}
