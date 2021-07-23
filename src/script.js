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

// Objects
let loader = new THREE.TextureLoader();
//let texture = loader.load("./textures/world-map-colored.jpg");
//let height = loader.load('./textures/world-height-map.png');

let height = loader.load('./textures/monochrome-height.jpg');
let texture = loader.load('./textures/monochrome-height.jpg');

const landGeometry = new THREE.PlaneBufferGeometry( 100, 50, 1012, 1012 );

let landMaterial = new THREE.MeshStandardMaterial( {
    map: texture,
    displacementMap: height,
    displacementScale: 1.5,
} );
let landPlane = new THREE.Mesh( landGeometry, landMaterial );
planeGroup.add( landPlane );

const waterGeometry = new THREE.PlaneBufferGeometry( 150, 75, 16, 16);

let waterMap = loader.load('./textures/water-normal-map.jpg');
waterMap.wrapS = THREE.RepeatWrapping;
waterMap.wrapT = THREE.RepeatWrapping;
waterMap.repeat.set(4,2);

let waterMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('skyblue'),
    normalMap: waterMap
})

let waterPlane = new THREE.Mesh( waterGeometry, waterMaterial );
planeGroup.add(waterPlane);
waterPlane.position.z=0.5
scene.add(planeGroup);


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
modelGroup.position.set(30,10,1.5);


scene.add(modelGroup);


//grid
const gridHelper = new THREE.GridHelper( 100, 10 );

scene.add( gridHelper );

gridHelper.rotateX(Math.PI / 2);
// Lights

const pointLight = new THREE.PointLight(0xffffed, 0.5)
pointLight.position.x = 30
pointLight.position.y = 0
pointLight.position.z = 40
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffed, 0.5)
pointLight2.position.x = -30
pointLight2.position.y = 0
pointLight2.position.z = 40
scene.add(pointLight2)

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
window.addEventListener('click', () => {
    launch = !launch; 
    console.log(launch);
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );
camera.position.z = 40;
camera.position.y = -20;
camera.lookAt(0,0,0);
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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
    // controls.update()

    // pointLight.position.x = 60 * Math.sin(elapsedTime);
    // pointLight.position.z = 60 * Math.cos(elapsedTime);
    // pointLight2.position.x = -60 * Math.sin(elapsedTime);
    // pointLight2.position.z = -60 * Math.cos(elapsedTime);

    waterPlane.material.normalScale.set( Math.sin(elapsedTime), Math.cos(elapsedTime));
    camera.position.x = 4 * Math.cos(elapsedTime * 0.1);
    camera.position.y = 2 * Math.sin(elapsedTime * 0.1); 
    camera.lookAt(0,0,0)

    if(launch){
        inclement *= 1.01;
        modelGroup.position.x += inclement; 
        console.log(modelGroup.position.x, inclement)
        if(modelGroup.position.x > 30){
            modelGroup.position.x = 0;
            console.log(modelGroup.position.x)
            launch = false;
        }
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()