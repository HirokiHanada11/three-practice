import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as dat from 'dat.gui'
import { MeshBasicMaterial } from 'three'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//group
const planeGroup = new THREE.Group();
const sphereGroup = new THREE.Group();

// Objects
let loader = new THREE.TextureLoader();
//let texture = loader.load("./textures/world-map-colored.jpg");
//let height = loader.load('./textures/world-height-map.png');

let height = loader.load('./textures/monochrome-height.jpg');

let texture = loader.load('./textures/monochrome-height.jpg');

//const landGeometry = new THREE.PlaneBufferGeometry( 100, 50, 1012, 1012 );
const landGeometry = new THREE.SphereBufferGeometry(20, 1024, 1024);

let landMaterial = new THREE.MeshStandardMaterial( {
    map: texture,
    displacementMap: height,
    displacementScale: 1,
} );
// let landPlane = new THREE.Mesh( landGeometry, landMaterial );
// planeGroup.add( landPlane );

let landSphere = new THREE.Mesh( landGeometry, landMaterial );
sphereGroup.add(landSphere);

//const waterGeometry = new THREE.PlaneBufferGeometry( 150, 75, 16, 16);
const waterGeometry = new THREE.SphereBufferGeometry(20.5, 16, 16);

let waterMap = loader.load('./textures/water-normal-map.jpg');
waterMap.wrapS = THREE.RepeatWrapping;
waterMap.wrapT = THREE.RepeatWrapping;
waterMap.repeat.set(4,2);

let waterMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('skyblue'),
    normalMap: waterMap
})

// let waterPlane = new THREE.Mesh( waterGeometry, waterMaterial );
// planeGroup.add(waterPlane);
// waterPlane.position.z=0.5
// scene.add(planeGroup);

let waterSphere = new THREE.Mesh( waterGeometry, waterMaterial );
sphereGroup.add(waterSphere);

scene.add(sphereGroup);


const sphereGeometry = new THREE.SphereGeometry( 1, 32, 32 );
const cylinderGeometry = new THREE.CylinderGeometry( 1.2, 0.2, 3, 32);

// Materials

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)

const modelGroup = new THREE.Group();

// Mesh
const sphere = new THREE.Mesh(sphereGeometry,material)
const cylinder = new THREE.Mesh(cylinderGeometry,material)
cylinder.position.z = 2;
cylinder.rotateX(- Math.PI / 2)
sphere.position.z = 4;
modelGroup.add(cylinder)
modelGroup.add(sphere)
modelGroup.position.setFromSphericalCoords(23,Math.PI/4,-Math.PI/4); //(radius, phi, theta) phi: yz plane theta: xz plane 

sphereGroup.add(modelGroup);

gui.add(modelGroup.rotation, 'x', 0, Math.PI * 2, Math.PI / 4);
gui.add(modelGroup.rotation, 'y', 0, Math.PI * 2, Math.PI / 4);
gui.add(modelGroup.rotation, 'z', 0, Math.PI * 2, Math.PI / 4);
//scene.add(modelGroup);


//grid
const gridHelper = new THREE.GridHelper( 100, 10 );

scene.add( gridHelper );

gridHelper.rotateX(Math.PI / 2);
// Lights

const pointLight = new THREE.PointLight(0xffffed, 1)
pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 80
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffed, 1)
pointLight2.position.x = 0
pointLight2.position.y = 0
pointLight2.position.z = -80
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0xffffed, 1)
pointLight3.position.x = 80
pointLight3.position.y = 0
pointLight3.position.z = 0
scene.add(pointLight3)

const pointLight4 = new THREE.PointLight(0xffffed, 1)
pointLight4.position.x = -80
pointLight4.position.y = 0
pointLight4.position.z = 0
scene.add(pointLight4)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

let launch = false; 
// window.addEventListener('click', () => {
//     launch = !launch; 
//     console.log(launch);
// })

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );
camera.position.z = 40;
camera.position.y = 0;
camera.lookAt(0,0,0);
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas);
// controls.enableRotate = true;
// controls.enableZoom = false;
// controls.maxAzimuthAngle = [-2*Math.PI, 2*Math.PI];
// controls.maxPolarAngle = 0;
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// //controls
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// controls.target.set(0, 1, 0)

/**
 * Animate
 */

const clock = new THREE.Clock()
let inclement = 0.01

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    controls.update()

    // pointLight.position.x = 60 * Math.sin(elapsedTime);
    // pointLight.position.z = 60 * Math.cos(elapsedTime);
    // pointLight2.position.x = -60 * Math.sin(elapsedTime);
    // pointLight2.position.z = -60 * Math.cos(elapsedTime);

    // sphereGroup.rotation.y = .5 *elapsedTime;
    //waterPlane.material.normalScale.set( Math.sin(elapsedTime), Math.cos(elapsedTime));
    waterSphere.material.normalScale.set( Math.sin(elapsedTime), Math.cos(elapsedTime));
    // camera.position.x = 4 * Math.cos(elapsedTime * 0.1);
    // camera.position.y = 2 * Math.sin(elapsedTime * 0.1); 
    // camera.lookAt(0,0,0)

    if(launch){
        inclement *= 1.01;
        modelGroup.position.x += inclement; 
        console.log(modelGroup.position.x, inclement)
        if(modelGroup.position.x > 30){
            modelGroup.position.x = 0;
            console.log(modelGroup.position.x)
            launch = false;
            inclement = 0.01;
        }
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()