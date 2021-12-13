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
//camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0, 0, 0);
  camera.up.set( 0, 10, 0 );
  camera.fov = 20;


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

function SpinBlades()
{
  if(animationOn)
  {
    for (let i = 0; i < eolics.length; i++) {
      eolics[i].defaultUpdate(speed + eolics[i].turbo);
    }
  }
}

var eolics = [];
function carregaEolics(){
  eolics = [];
  for (let i = 0; i < 10; i++) {
    var eolicTurbine = new Turbina();
    eolics.push(eolicTurbine);
    eolics[i].position.set(60*i, 0.0, 0.0);
    scene.add(eolics[i]);
  }
}

//guia
const radius = 1

//ghost guia
const desvio = 10;
var ghostguide = createSphere(radius);
ghostguide.position.set(0.0, 0.0, 2*radius + desvio);

var player = new Car();
player.position.set(0.0, 1.3, 20.0);
player.add(ghostguide);

scene.add(player);
var posAtual = new THREE.Vector3(0, 0, 0);
posAtual.set(player.position.getComponent(0), player.position.getComponent(1), player.position.getComponent(2));

//cria esfera guia
function createSphere(radius)
{
    var guideSphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
    var guideSphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(255,0,0)'} );
    var guideSphere = new THREE.Mesh( guideSphereGeometry, guideSphereMaterial );
    guideSphere.visible = false;
    return guideSphere;
}

//-------------------------------------------------------------------------------
// Camera
//-------------------------------------------------------------------------------

var cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
cameraHolder.position.set(60, 20, 0);
cameraHolder.lookAt(posAtual)
cameraHolder.rotateY(degreesToRadians(180))

scene.add(player);
scene.add(cameraHolder);


//-------------------------------------------------------------------------------
// Movimentação e Verificação se Saiu Pista
//-------------------------------------------------------------------------------
var keyboard = new KeyboardState();
var Speed = 5;
var aceleracao = 20;
var freia = -20;
var redutor = 1;
var speedForward = 0;
var speedBackward = 0;
var tempoJogoAnterior = 0;
var panoramico = false;

//animation control
var carroAcelerando = false; // control if animation is on or of
var carroFreiando = false; // control if animation is on or of

//acelera e freia o carro
function aceleraCarro(aceleracaoAnterior)
{
    if(carroAcelerando){
        if(aceleracao < 300){
            aceleracao += redutor*aceleracaoAnterior/100;
        }
    }
    else if(!carroAcelerando){
        if (aceleracao > 20 && speedForward > 0){
            aceleracao -= redutor*aceleracaoAnterior/10;
            player.accelerate(aceleracao/100);
        }
    }
    aceleracaoAnterior = aceleracao
}
function freiaCarro(freiaAnterior)
{
    if(carroFreiando){
        if(freia > -300){
            freia += redutor*freiaAnterior/100;
        }
    }
    else if(!carroFreiando){
        if (freia < -20){
            freia -= redutor*freiaAnterior/10;
            player.accelerate(freia/100);
        }
    }
    freiaAnterior = freia
}



var keyboard = new KeyboardState();
function keyboardUpdate() {
  keyboard.update();

  if (keyboard.pressed("X")){
      carroAcelerando = true;
      speedForward = (Speed/100 + aceleracao/100)*redutor;
      //evita bug ao sair da pag, devido aos cálculos que continuam sendo feitos em segundo plano pelo browser
      if(speedForward < -0.01){
          speedForward = 1;
          aceleracao = 1;
      }
      console.log(speedForward);
      player.accelerate(speedForward);
      player.defaultUpdate();
  }
  else if (keyboard.up("X")) {
      carroAcelerando = false;
      player.defaultUpdate();
  }

  if(keyboard.pressed("down")) {
      carroFreiando = true
      speedBackward = (-Speed/100 + freia/100)*redutor;
      //evita bug ao sair da pag, devido aos cálculos que continuam sendo feitos em segundo plano pelo browser
      if(speedBackward > 0.01){
          speedBackward = -1;
          aceleracao = 1;
      }
      player.accelerate(speedBackward);
      player.defaultUpdate();
  }
  else if (keyboard.up("down")) {
      carroFreiando = false
      player.defaultUpdate();
  }

  if (keyboard.pressed("left")) {
      if(aceleracao > 1 || freia < -1){
          player.turnLeft(5);
      }
  }
  else if (keyboard.pressed("right")) {
      if(aceleracao > 1 || freia < -1){
          player.turnRight(5);
      }
  }
  if (keyboard.pressed(",")){
    panoramico = true;
  }
  else if (keyboard.pressed(".")){
    panoramico = false;
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

function verificaEolicTurbo(eolicsEmK){
  if(speedForward > 2.0){
    if(eolicsEmK.turbo <= 10){
      eolicsEmK.turbo += speedForward;
    }
  }
  else if(speedBackward < 2.0){
    if(eolicsEmK.turbo <= 10){
      eolicsEmK.turbo -= speedBackward;
    }
  }
}
function resetaEolicsTurbo(eolicsEmKReset){
  if(eolicsEmKReset.turbo > 0.1){
    eolicsEmKReset.turbo -= 0.1;
  }
}

var blocoSize = 100;
var diffX = 0;
var diffZ = 0;
function verificaProximidadeEolic(){
  for (var k = 0; k < eolics.length; k ++){
      diffX = Math.abs(player.position.getComponent(0) - 1 - eolics[k].position.getComponent(0));
      diffZ = Math.abs(player.position.getComponent(2) + 1 - eolics[k].position.getComponent(2));
      if( diffX <= blocoSize/2 && diffZ <= blocoSize/2){
        verificaEolicTurbo(eolics[k]);
      }
      else{
        resetaEolicsTurbo(eolics[k]);
      }
  }
}

carregaEolics();
buildInterface();
render();
function render() {

  keyboardUpdate();
  aceleraCarro(aceleracao);
  freiaCarro(freia);
  player.defaultUpdate();
  posAtual.set(player.position.getComponent(0), player.position.getComponent(1), player.position.getComponent(2));
  cameraHolder.lookAt(ghostguide.getWorldPosition(new THREE.Vector3()));
  cameraHolder.position.set(player.position.getComponent(0)+40, player.position.getComponent(1)+80, player.position.getComponent(2)+100);
  if (panoramico){
      cameraHolder.position.set(player.position.getComponent(0)+140, player.position.getComponent(1)+80, player.position.getComponent(2)+150);
  }
  cameraHolder.rotateY(degreesToRadians(180));
  stats.update(); // Update FPS
  verificaProximidadeEolic();
  SpinBlades();
  //trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera); // Render scene
}
