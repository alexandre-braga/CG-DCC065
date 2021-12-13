import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer,
        InfoBox,
        SecondaryBox,
        createGroundPlane,
        onWindowResize,
        degreesToRadians,
        createLightSphere} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(4.18, 3.0, 5.0);
  camera.up.set( 0, 1, 0 );
var objColor = "rgb(255,255,255)";
var objShininess = 200;

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlane(4.0, 2.5, 100, 100); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 1.5 );
  axesHelper.visible = false;
scene.add( axesHelper );

// Show text information onscreen
showInformation();

var infoBox = new SecondaryBox("");

// Teapot
var geometry = new TeapotGeometry(0.5);
var material = new THREE.MeshPhongMaterial({color:objColor, shininess:"200"});
  material.side = THREE.DoubleSide;
var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.position.set(0.0, 0.5, 0.0);
scene.add(obj);

const radius = 2.0;
// Torus
const torusGeometry = new THREE.TorusGeometry( radius, 0.05 , 10, 100 );
const torusMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, shininess:"200" } );
torusMaterial.side = THREE.DoubleSide;
var torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.castShadow = true;
  torus.position.set(0.0, 2, 0.0);
scene.add(torus);
torus.rotateX(degreesToRadians(90));

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
// Control available light and set the active light
var lightArray = new Array();
var activeLight = 0; // View first Light
var lightIntensity = 2.0;

//---------------------------------------------------------
// Default light position, color, ambient color and intensity
var ambientlightPosition = new THREE.Vector3(1.7, 20.0, 1.1);
var redLightColor = "rgb(255,0,0)";
var greenLightColor = "rgb(0,255,0)";
var blueLightColor = "rgb(0,0,255)";
var ambientColor = "rgb(100,100,100)";

// Sphere to represent the light
const redGeometry = new THREE.SphereGeometry( 0.2, 32, 16 );
const redMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, shininess:"300" } );
var red = new THREE.Mesh(redGeometry, redMaterial);
  red.castShadow = true;
  red.position.set(0.0, 0.0, radius);
var redController = new THREE.Mesh(redGeometry, redMaterial.clone());
  redController.material.visible = false;
  redController.position.set(0.0, 2.0, 0.0);
redController.add(red);
scene.add(redController);

const greenGeometry = new THREE.SphereGeometry( 0.2, 32, 16 );
const greenMaterial = new THREE.MeshPhongMaterial( { color: 0x00ff00, shininess:"300" } );
var green = new THREE.Mesh(greenGeometry, greenMaterial);
  green.castShadow = true;
  green.position.set(0.0, 0.0, -radius);
var greenController = new THREE.Mesh(greenGeometry, greenMaterial.clone());
  greenController.material.visible = false;
  greenController.position.set(0.0, 2.0, 0.0);
greenController.add(green);
scene.add(greenController);


const blueGeometry = new THREE.SphereGeometry( 0.2, 32, 16 );
const blueMaterial = new THREE.MeshPhongMaterial( { color: 0x0000ff, shininess:"300" } );
var blue = new THREE.Mesh(blueGeometry, blueMaterial);
  blue.castShadow = true;
  blue.position.set(2.0, 0.0, 0.0);
var blueController = new THREE.Mesh(blueGeometry, blueMaterial.clone());
  blueController.material.visible = false;
  blueController.position.set(0.0, 2.0, 0.0);
blueController.add(blue);
scene.add(blueController);


//---------------------------------------------------------
// Create and set all lights. Only Spot and ambient will be visible at first
var redspotLight = new THREE.SpotLight(redLightColor);
setSpotLight(redspotLight, "redLight", red.getWorldPosition(new THREE.Vector3()));

var greenspotLight = new THREE.SpotLight(greenLightColor);
setSpotLight(greenspotLight, "greenLight", green.getWorldPosition(new THREE.Vector3()));

var bluespotLight = new THREE.SpotLight(blueLightColor);
setSpotLight(bluespotLight, "blueLight", blue.getWorldPosition(new THREE.Vector3()));

// More info here: https://threejs.org/docs/#api/en/lights/AmbientLight
var ambientspotLight = new THREE.SpotLight(ambientColor);
setSpotLight(ambientspotLight, "ambientLight", new THREE.Vector3(0,100,0));
scene.add( ambientspotLight );

buildInterface();
render();


// Set Spotlight
// More info here: https://threejs.org/docs/#api/en/lights/SpotLight
function setSpotLight(spotLight, lightName, position)
{
  spotLight.position.copy(position);
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.angle = degreesToRadians(40);
  spotLight.castShadow = true;
  spotLight.decay = 2;
  spotLight.penumbra = 0.5;
  spotLight.name = lightName;

  scene.add(spotLight);
  lightArray.push( spotLight );
  console.log(lightArray);
}

// Update light intensity of the current light
function updateLightIntensity()
{
  lightArray[0].intensity = lightIntensity;
  lightArray[1].intensity = lightIntensity;
  lightArray[2].intensity = lightIntensity;
}

function buildInterface()
{
  //------------------------------------------------------------
  // Interface
  var controls = new function ()
  {
    this.viewAxes = false;
    this.color = objColor;
    this.shininess = objShininess;
    this.lightIntensity = lightIntensity;
    this.lightType = 'Spot'
    this.ambientspotLight = true;
    this.redspotLightBoolean = true;
    this.greenspotLightBoolean = true;
    this.bluespotLightBoolean = true;

    this.onEnableAmbientLight = function(){
      ambientspotLight.visible = this.ambientspotLight;
    };
    /*this.onEnableRedLight = function(){
      redspotLight.visible = this.redspotLightBoolean;
    };
    this.onEnableGreenLight = function(){
      greenspotLight.visible = this.greenspotLightBoolean;
    };
    this.onEnableBlueLight = function(){
      bluespotLight.visible = this.bluespotLightBoolean;
    };*/
    this.updateColor = function(){
      material.color.set(this.color);
    };
    this.onUpdateShininess = function(){
      material.shininess = this.shininess;
    };
    this.onUpdateLightIntensity = function(){
      lightIntensity = this.lightIntensity;
      updateLightIntensity();
    };
  };

  var gui = new GUI();
  gui.add(controls, 'shininess', 0, 1000)
    .name("Obj Shininess")
    .onChange(function(e) { controls.onUpdateShininess() });
  gui.add(controls, 'lightIntensity', 0, 5)
    .name("Light Intensity")
    .onChange(function(e) { controls.onUpdateLightIntensity() });
  gui.add(controls, 'ambientspotLight', true)
    .name("Ambient Light")
    .onChange(function(e) { controls.onEnableAmbientLight() });
  /*gui.add(controls, 'redspotLightBoolean', true)
    .name("Red Light")
    .onChange(function(e) { controls.onEnableRedLight() });
  gui.add(controls, 'redspotLightBoolean', true)
    .name("Green Light")
    .onChange(function(e) { controls.onEnableGreenLight() });
  gui.add(controls, 'redspotLightBoolean', true)
    .name("Blue Light")
    .onChange(function(e) { controls.onEnableBlueLight() });*/
}

var redON = false;
var greenON = false;
var blueON = false;

function keyboardUpdate()
{
  keyboard.update();

  if ( keyboard.pressed("Q") ){
    redspotLight.visible = true;
  }
  if ( keyboard.pressed("W") )
  {
    redController.rotateY(degreesToRadians(1));
    redspotLight.position.copy(red.getWorldPosition(new THREE.Vector3()));
  }
  else if ( keyboard.pressed("E") )
  {
    redController.rotateY(degreesToRadians(-1));
    redspotLight.position.copy(red.getWorldPosition(new THREE.Vector3()));
  }
  if ( keyboard.pressed("R") ){
    redspotLight.visible = false;
  }


  if ( keyboard.pressed("A") ){
    greenspotLight.visible = true;
  }
  if ( keyboard.pressed("S") )
  {
    greenController.rotateY(degreesToRadians(1));
    greenspotLight.position.copy(green.getWorldPosition(new THREE.Vector3()));
  }
  else if ( keyboard.pressed("D") )
  {
    greenController.rotateY(degreesToRadians(-1));
    greenspotLight.position.copy(green.getWorldPosition(new THREE.Vector3()));
  }
  if ( keyboard.pressed("F") ){
    greenspotLight.visible = false;
  }



  if ( keyboard.pressed("Z") ){
    bluespotLight.visible = true;
  }
  if ( keyboard.pressed("X") )
  {
    blueController.rotateY(degreesToRadians(1));
    bluespotLight.position.copy(blue.getWorldPosition(new THREE.Vector3()));
  }
  else if ( keyboard.pressed("C") )
  {
    blueController.rotateY(degreesToRadians(-1));
    bluespotLight.position.copy(blue.getWorldPosition(new THREE.Vector3()));
  }
  if ( keyboard.pressed("V") ){
    bluespotLight.visible = false;
  }

}

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
    controls.add("Lighting - Types of Lights");
    controls.addParagraph();
    controls.add("Use the QWER keys to control the redlight");
    controls.add("Use the ASDF keys to control the greenlight");
    controls.add("Use the ZXCV keys to control the bluelight");
    controls.show();
}

function render()
{
  stats.update();
  trackballControls.update();
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
