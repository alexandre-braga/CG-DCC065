import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
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

//camera
var camera = initCamera(new THREE.Vector3(0, 0, 0));
var cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
cameraHolder.position.set(0, 10, 30);
scene.add(cameraHolder);

//light
scene.add(new THREE.HemisphereLight());

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

//variaveis
//var trackballControls = new TrackballControls(camera, renderer.domElement );

var keyboard = new KeyboardState();
var pos = [0,0,0]

//animation control
const speed = 0.5;
var passos = 1/speed
var animationOn = true; // control if animation is on or of
var passoX = 0;
var passoY = 0;
var passoZ = 0;


//sphere
const radius = 1
var sphere = createSphere(radius);
sphere.position.set(0.0, radius, 0.0);
scene.add(sphere);
var posAtual = new THREE.Vector3;
posAtual = sphere.position;
//cria esfera
function createSphere(radius)
{
  var sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(255,0,0)'} );
  var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  return sphere;
}

//anima a esfera
function moveSphere()
{

  sphere.matrixAutoUpdate = false;
  var mat4 = new THREE.Matrix4();
  sphere.matrix.identity();

  if(animationOn)
  {
    passoX = (pos[0]-posAtual[0])/passos;
    passoY = (pos[1]-posAtual[1])/passos;
    passoZ = (pos[2]-posAtual[2])/passos;
    if (posAtual[0] > pos[0]){
        sphere.translateX(-passoX)
    }
    else if (posAtual[0] < pos[0]){
        sphere.translateX(passoX)
    }
    if (posAtual[1] > pos[1]){
        sphere.translateY(-passoY)
    }
    else if (posAtual[1] < pos[1]){
        sphere.translateY(passoY)
    }
    if (posAtual[2] > pos[2]){
        sphere.translateZ(-passoZ)
    }
    else if (posAtual[2] < pos[2]){
        sphere.translateZ(passoZ)
    }
    sphere.matrix.multiply(mat4.makeTranslation(passoXYZ));
    posAtual = sphere.position;
    console.log(passoX,passoY,passoZ)
    console.log(posAtual)

  }
  else
  {
    sphere.matrix.multiply(mat4.makeTranslation(posAtual[0], posAtual[1], posAtual[2]));
  }

}

var cameraSpeed = 2;
function keyboardUpdate() {
    keyboard.update();

    if (keyboard.pressed("K")) {
        cameraHolder.translateZ(-cameraSpeed);
    }

    if (keyboard.pressed("I")) {
        cameraHolder.translateZ(cameraSpeed);
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
const planeSize = 25
var plane = createGroundPlaneWired(planeSize, planeSize, 80, 80);
// add the plane to the scene
scene.add(plane);

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Aula 03");
  controls.addParagraph();
  controls.add("Use keyboard to interact:");
  controls.add("* AWSD to rotate");
  controls.add("* J/L to turn left/right");
  controls.add("* K/I to go forwards/backwards.");
  controls.show();

  function buildInterface()
  {
    var controls = new function ()
    {
        this.onChangeAnimation = function(){
            animationOn = !animationOn;
        };
        this.speed = 0.05;
        this.joint1 = 0;
        this.joint2 = radius;
        this.joint3 = 0;

        this.move = function(){
            pos[0] = (this.joint1);
            pos[1] = (this.joint2);
            pos[2] = (this.joint3);
            moveSphere();
        };
    };

    // GUI interface
    var gui = new GUI();
    gui.add(controls, 'joint1', -planeSize/2+radius, planeSize/2-radius)
      .onChange(function() { controls.move() })
      .name("Position X");
    gui.add(controls, 'joint2', radius, planeSize)
      .onChange(function() { controls.move() })
      .name("Position Y");
    gui.add(controls, 'joint3', -planeSize/2+radius, planeSize/2-radius)
      .onChange(function() { controls.move() })
      .name("Position Z");
    gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");

}

buildInterface();
render();
function render()
{
  stats.update(); // Update FPS
  requestAnimationFrame(render);
  //trackballControls.update();
  keyboardUpdate();
  renderer.render(scene, camera) // Render scene
}