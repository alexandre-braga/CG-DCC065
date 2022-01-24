import * as THREE from  '../libs/other/three.module.r82.js';
import {RaytracingRenderer} from  '../libs/other/raytracingRenderer.js';
import {degreesToRadians, initRenderer} from "../libs/util/util.js";

var scene, renderer;

var container = document.createElement( 'div' );
document.body.appendChild( container );

var scene = new THREE.Scene();

// The canvas is in the XY plane.
// Hint: put the camera in the positive side of the Z axis and the
// objects in the negative side
var camera = new THREE.PerspectiveCamera( 60, 2 / 1, 0.1, 1000 );
camera.position.z = 4.0;
camera.position.y = 2.5;

// light
var intensity = 0.5;
var light = new THREE.PointLight( 0xffffff, intensity );
light.position.set( 0, 3.0, 2);
scene.add( light );

var light = new THREE.PointLight( 0x55aaff, intensity );
light.position.set( -1.00, 2.25, 4.00 );
scene.add( light );

var light = new THREE.PointLight( 0xffffff, intensity );
light.position.set( 1.00, 2.25, 4.00 );
scene.add( light );

renderer = new RaytracingRenderer(window.innerWidth, window.innerHeight, 32, camera);
container.appendChild( renderer.domElement );

// materials
var phongMaterialBox = new THREE.MeshLambertMaterial( {
	color: "rgb(255,255,255)",
} );

var phongMaterialBoxBottom = new THREE.MeshPhongMaterial( {
	color: "rgb(211,211,211)",
} );

var phongMaterialBoxLeft = new THREE.MeshPhongMaterial( {
	color: "rgb(104,88,243)",
} );

var phongMaterialBoxRight = new THREE.MeshPhongMaterial( {
	color: "rgb(104,88,243)",
} );

var phongMaterial = new THREE.MeshPhongMaterial( {
	color: "#ff0000",
	specular: "rgb(255,255,255)",
	shininess: 10000,
} );
phongMaterial.reflectivity = 0.9;

var phongMaterialVermelho = new THREE.MeshPhongMaterial( {
	color: "rgb(255,0,0)",
	specular: "rgb(90,90,90)",
	shininess: 1000,
} );
phongMaterialVermelho.mirror = true;
phongMaterialVermelho.reflectivity = 0.4;

var phongMaterialDourado = new THREE.MeshPhongMaterial( {
	color: "rgb(255,170,0)",
	specular: "rgb(34,34,34)",
	shininess: 10000,
} );

var mirrorMaterial = new THREE.MeshPhongMaterial( {
	color: "rgb(0,0,0)",
	specular: "rgb(255,255,255)",
	shininess: 1000,
} );
mirrorMaterial.mirror = true;
mirrorMaterial.reflectivity = 1.5;

var mirrorMaterialDark = new THREE.MeshPhongMaterial( {
	color: "rgb(0,0,0)",
	specular: "rgb(170,170,170)",
	shininess: 10000,
} );
mirrorMaterialDark.mirror = true;
mirrorMaterialDark.reflectivity = 1;

var mirrorMaterialSmooth = new THREE.MeshPhongMaterial( {
	color: "rgb(255,170,0)",
	specular: "rgb(34,34,34)",
	shininess: 10000,
} );
mirrorMaterialSmooth.mirror = true;
mirrorMaterialSmooth.reflectivity = 0.1;

var glassMaterialSmooth = new THREE.MeshPhongMaterial( {
	color: "rgb(0,0,0)",
	specular: "rgb(255,255,255)",
	shininess: 100,
} );
glassMaterialSmooth.glass = true;
glassMaterialSmooth.reflectivity = 0.25;
glassMaterialSmooth.refractionRatio = 1.5;

// geometries
var sphereGeometry = new THREE.SphereGeometry( 0.45, 24, 24 );
var planeGeometry = new THREE.BoxGeometry( 6.00, 0.05, 7.00 );
var planeLateralGeometry = new THREE.BoxGeometry( 3.00, 0.05, 7.00 );
var planeBackGeometry = new THREE.BoxGeometry( 6.00, 0.05, 3.00 );

var cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 80);
var vasoGeo = new THREE.CylinderGeometry(0.4, 0.15, 0.9, 80);
var pretzelGeo = new THREE.TorusKnotGeometry( 0.2, 0.06, 64, 8, 2, 3 );

var cylinder1 = new THREE.Mesh( cylinderGeometry, phongMaterialBoxBottom);
cylinder1.position.set(-1.9, 1.5, -0.65);
scene.add(cylinder1);

var cylinder2 = new THREE.Mesh( cylinderGeometry, phongMaterialBoxBottom);
cylinder2.position.set(0, 1.5, -1.6);
scene.add(cylinder2);

var cylinder3 = new THREE.Mesh( cylinderGeometry, phongMaterialBoxBottom);
cylinder3.position.set(1.9, 1.5, -0.65);
scene.add(cylinder3);

var ball = new THREE.Mesh( sphereGeometry, mirrorMaterial);
ball.position.set(0, 2.5, -1.3);
scene.add(ball);

var pretzel = new THREE.Mesh( pretzelGeo, phongMaterialDourado);
pretzel.position.set(-1.9, 2.35, -0.65);
scene.add(pretzel);

var vaso = new THREE.Mesh (vasoGeo, phongMaterialVermelho);
vaso.position.set(1.9, 2.35, -0.65);
scene.add(vaso);

// bottom
var planeBottom = new THREE.Mesh( planeGeometry, phongMaterialBoxBottom );
planeBottom.position.set( 0, 1.0, -3.00 );
scene.add( planeBottom );

// top
var planeTop = new THREE.Mesh( planeGeometry, phongMaterialBoxBottom );
planeTop.position.set( 0, 4.0, -3.00 );
scene.add( planeTop );

// back
var planeBack = new THREE.Mesh( planeBackGeometry, phongMaterialBox );
planeBack.rotation.x = 1.57;
planeBack.position.set( 0, 2.50, -3.00 );
scene.add( planeBack );

// left
var planeLeft = new THREE.Mesh( planeLateralGeometry, phongMaterialBoxLeft );
planeLeft.rotation.z = 1.57;
planeLeft.position.set( -3.00, 2.50, -3.00 )
scene.add( planeLeft );

// right
var plane = new THREE.Mesh( planeLateralGeometry, phongMaterialBoxRight );
plane.rotation.z = 1.57;
plane.position.set( 3.00, 2.50, -3.00 )
scene.add( plane );

render();

function render()
{
	renderer.render( scene, camera );
}
