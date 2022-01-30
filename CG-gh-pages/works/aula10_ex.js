import * as THREE from  '../build/three.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {ARjs}    from  '../libs/AR/ar.js';
import {GLTFLoader} from '../build/jsm/loaders/GLTFLoader.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {InfoBox,
        SecondaryBox,
        initDefaultSpotlight,
        createGroundPlane,
        getMaxSize,
        onWindowResize,
        degreesToRadians,
        lightFollowingCamera} from "../libs/util/util.js";

var renderer	= new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setSize( 640, 480 );
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.shadowMap.enabled = true;

var keyboard = new KeyboardState();
document.body.appendChild( renderer.domElement );
// init scene and camera
var scene	= new THREE.Scene();
var camera = new THREE.Camera();
scene.add(camera);

// array of functions for the rendering loop
var onRenderFcts= [];

// Show text information onscreen
showInformation();

//----------------------------------------------------------------------------
// Handle arToolkitSource
// More info: https://ar-js-org.github.io/AR.js-Docs/marker-based/
//var arToolkitSource = new THREEx.ArToolkitSource({
var arToolkitSource = new ARjs.Source({
	// to read from the webcam
	//sourceType : 'webcam',

	// to read from an image
	//sourceType : 'image',
	//sourceUrl : '../assets/AR/kanjiScene.jpg',

	// to read from a video
	sourceType : 'video',
	sourceUrl : '../assets/AR/kanjiScene.mp4'
})

arToolkitSource.init(function onReady(){
	setTimeout(() => {
		onResize()
	}, 2000);
})

// handle resize
window.addEventListener('resize', function(){
	onResize()
})

function onResize(){
	arToolkitSource.onResizeElement()
	arToolkitSource.copyElementSizeTo(renderer.domElement)
	if( arToolkitContext.arController !== null ){
		arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
	}
}

//----------------------------------------------------------------------------
// initialize arToolkitContext
//
// create atToolkitContext
//var arToolkitContext = new THREEx.ArToolkitContext({
var arToolkitContext = new ARjs.Context({
	cameraParametersUrl: '../libs/AR/data/camera_para.dat',
	detectionMode: 'mono',
})

// initialize it
arToolkitContext.init(function onCompleted(){
	// copy projection matrix to camera
	camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
})

// update artoolkit on every frame
onRenderFcts.push(function(){
	if( arToolkitSource.ready === false )	return
	arToolkitContext.update( arToolkitSource.domElement )
	// update scene.visible if the marker is seen
	scene.visible = camera.visible
})

//----------------------------------------------------------------------------
// Create a ArMarkerControls
//
// init controls for camera
//var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
var markerControls = new ARjs.MarkerControls(arToolkitContext, camera, {
	type : 'pattern',
	patternUrl : '../libs/AR/data/patt.kanji',
	changeMatrixMode: 'cameraTransformMatrix' // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
})
// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false

//----------------------------------------------------------------------------
// Adding object to the scene

var light = initDefaultSpotlight(scene, new THREE.Vector3(-3, 4, 2)); // Use default light
var lightSphere = createSphere(0.1, 10, 10);
  lightSphere.position.copy(light.position);
  lightSphere.visible = false;
scene.add(lightSphere);

var groundPlane = createGroundPlane(2.0, 2.0); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
  groundPlane.material.transparent = true;
  groundPlane.material.opacity = 0.3;
  groundPlane.visible = true;
  groundPlane.castShadow = false;
scene.add(groundPlane);

var gltfArray = new Array();
var playAction = true;
var mixer = new Array();

loadGLTFFile('../assets/objects/', 'dog', 2.0, 0, true);
function loadGLTFFile(modelPath, modelFolder, desiredScale, angle, visibility)
{
  var loader = new GLTFLoader( );
  loader.load( modelPath + modelFolder + '/scene.gltf', function ( gltf ) {
    var obj = gltf.scene;
    obj.visible = visibility;
    obj.name = modelFolder;
    obj.traverse( function ( child ) {
      if ( child ) {
          child.castShadow = true;
      }
    });
    obj.traverse( function( node )
    {
      if( node.material ) node.material.side = THREE.DoubleSide;
    });

    var obj = normalizeAndRescale(obj, desiredScale);
    var obj = fixPosition(obj);
    obj.rotateY(degreesToRadians(angle));

    scene.add ( obj );
    gltfArray.push( obj );

    var mixerLocal = new THREE.AnimationMixer(obj);
    mixerLocal.clipAction( gltf.animations[0] ).play();
    mixer.push(mixerLocal);

    });
}

// Normalize scale and multiple by the newScale
function normalizeAndRescale(obj, newScale)
{
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

function fixPosition(obj)
{
  // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject( obj );
  if(box.min.y > 0)
    obj.translateY(-box.min.y);
  else
    obj.translateY(-1*box.min.y);
  return obj;
}

function createSphere(radius, widthSegments, heightSegments)
{
  var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
  var material = new THREE.MeshBasicMaterial({color:"rgb(255,255,50)"});
  var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
	object.visible = false;
  return object;
}


// add a torus knot
var cubeKnot = new THREE.Object3D();
createCubeKnot();
cubeKnot.visible = false;
scene.add( cubeKnot );

// controls which object should be rendered
var firstObject = true;

var controls = new function ()
{
	this.onChangeObject = function(){
		firstObject = !firstObject;
		if(firstObject)
		{
			gltfArray[0].visible = true;
			groundPlane.visible = true;
			lightSphere.visible = true;
			cubeKnot.visible = false;
		}
		else
		{
			gltfArray[0].visible = false;
			groundPlane.visible = false;
			lightSphere.visible = true;
			cubeKnot.visible = true;
		}
	};
};

// GUI interface
//var gui = new dat.GUI();
var gui = new GUI();
gui.add(controls, 'onChangeObject').name("Change Object");

//----------------------------------------------------------------------------
// Render the whole thing on the page

// render the scene
onRenderFcts.push(function(){
	renderer.render( scene, camera );
})

function createCubeKnot()
{
	var geometry	= new THREE.BoxGeometry(1,1,1);
	var material	= new THREE.MeshNormalMaterial({
		transparent : true,
		opacity: 0.5,
		side: THREE.DoubleSide
	});
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= geometry.parameters.height/2
	cubeKnot.add( mesh );

	var geometry	= new THREE.TorusKnotGeometry(0.3,0.1,64,16);
	var material	= new THREE.MeshNormalMaterial();
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= 0.5
	cubeKnot.add( mesh );

	onRenderFcts.push(function(delta){
		mesh.rotation.x += Math.PI*delta
	})
}

function showInformation()
{
	// Use this to show information onscreen
	controls = new InfoBox();
		controls.add("Augmented Reality - Basic Example");
		controls.addParagraph();
		controls.add("Put the 'KANJI' marker in front of the camera.");
		controls.show();
}

function keyboardUpdate() {
    keyboard.update();

    if (keyboard.pressed("A")) {
        groundPlane.rotateZ(degreesToRadians(2));
		gltfArray[0].rotateY(degreesToRadians(2));
    }
    else if (keyboard.pressed("D")) {
        groundPlane.rotateZ(degreesToRadians(-2));
		gltfArray[0].rotateY(degreesToRadians(-2));
	}

    if (keyboard.pressed("W")) {
        groundPlane.rotateX(degreesToRadians(2));
		gltfArray[0].rotateX(degreesToRadians(2));

    }
    else if (keyboard.pressed("S")) {
        groundPlane.rotateX(degreesToRadians(-2));
        gltfArray[0].rotateX(degreesToRadians(-2));
    }
}

// run the rendering loop
requestAnimationFrame(function animate(nowMsec)
{
	var lastTimeMsec= null;
	// keep looping
	requestAnimationFrame( animate );
	keyboardUpdate();
	// measure time
	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec	= nowMsec
	// call each update function
	onRenderFcts.forEach(function(onRenderFct){
		onRenderFct(deltaMsec/1000, nowMsec/1000)
		// Animation control
		if (playAction) {
			for(var i = 0; i<mixer.length; i++)
				mixer[i].update( deltaMsec/5000 );
		}
	})
})
