import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import KeyboardState from '../libs/util/KeyboardState.js';
//import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
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
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0, 0, 0);
  camera.up.set( 0, 5, 0 );

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
var pos = new THREE.Vector3(0,0,0);

//sphere
const radius = 1
var sphere = createSphere(radius);
sphere.position.set(0.0, radius, 0.0);
scene.add(sphere);
var posAtual = new THREE.Vector3(sphere.position.getComponent(0), radius, sphere.position.getComponent(2));
posAtual.copy(sphere.position);

//animation control
const speed = 0.055;
var animationOn = false; // control if animation is on or of
var passoX = 0;
var passoY = radius;
var passoZ = 0;

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
    sphere.matrix.multiply(mat4.makeTranslation(0.0, radius, 0.0));
    if(animationOn)
    {
        console.log("posAtual", posAtual)
        console.log("spherePosition", sphere.position)
        console.log("pos", pos)

        if (pos.getComponent(0) == posAtual.getComponent(0)){
            passoX = 0;
            console.log(passoX);
        }
        else if (pos.getComponent(0) > posAtual.getComponent(0)){
            passoX+=speed;
        }
        else if (pos.getComponent(0) < posAtual.getComponent(0)){
            passoX-=speed;
        }

        if (pos.getComponent(1) == posAtual.getComponent(1)){
            passoY = 0;
            console.log(passoY);
        }
        else if (pos.getComponent(1) > posAtual.getComponent(1)){
            passoY+=speed;
        }
        else if (pos.getComponent(1) < posAtual.getComponent(1)){
            passoY-=speed;
        }

        if (pos.getComponent(2) == posAtual.getComponent(2)){
            passoZ = 0;
            console.log(passoZ);
        }
        else if (pos.getComponent(2) > posAtual.getComponent(2)){
            passoZ+=speed;
        }
        else if (pos.getComponent(2) < posAtual.getComponent(2)){
            passoZ-=speed;
        }
        sphere.matrix.multiply(mat4.makeTranslation(passoX, passoY, passoZ));
        sphere.position.setComponent(0, passoX);
        sphere.position.setComponent(1, passoY);
        sphere.position.setComponent(2, passoZ);
        posAtual.copy(sphere.position);
    }

    else
    {
        sphere.matrix.multiply(mat4.makeTranslation(posAtual.getComponent(0), posAtual.getComponent(1), posAtual.getComponent(2)));
        console.log(posAtual)
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
        this.joint2 = 0;
        this.joint3 = 0;

        this.move = function(){
            pos.setComponent(0, this.joint1);
            pos.setComponent(1, this.joint2);
            pos.setComponent(2, this.joint3);
            moveSphere();
        };
    };

    // GUI interface
    var gui = new GUI();
    gui.add(controls, 'joint1', -planeSize/2+radius, planeSize/2-radius)
      .onChange(function() { controls.move() })
      .name("Position X");
    gui.add(controls, 'joint2', 0, planeSize)
      .onChange(function() { controls.move() })
      .name("Position Y");
    gui.add(controls, 'joint3', -planeSize/2+radius, planeSize/2-radius)
      .onChange(function() { controls.move() })
      .name("Position Z");
    gui.add(controls, 'onChangeAnimation',true).name("Mover On/Off");

}

buildInterface();
render();
function render()
{
  stats.update(); // Update FPS
  requestAnimationFrame(render);
  //trackballControls.update();
  keyboardUpdate();
  moveSphere();
  renderer.render(scene, camera) // Render scene
}