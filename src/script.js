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

let height = loader.load('./textures/world-height-map-v8.jpg');

let texture = loader.load('./textures/world-height-map-v8.jpg');

//const landGeometry = new THREE.PlaneBufferGeometry( 100, 50, 1012, 1012 );
const landGeometry = new THREE.SphereBufferGeometry(20, 512, 256);

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
const waterGeometry = new THREE.SphereBufferGeometry(20.5, 32, 32);

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
cylinder.position.z = -2;
cylinder.rotateX( Math.PI / 2)
sphere.position.z = -4;
modelGroup.add(cylinder)
modelGroup.add(sphere)
modelGroup.position.setFromSphericalCoords(20,Math.PI/3,-Math.PI/4); //(radius, phi, theta) phi: yz plane theta: xz plane 
modelGroup.lookAt(0,0,0);
sphereGroup.add(modelGroup);

//scene.add(modelGroup);


//grid
const gridHelper = new THREE.GridHelper( 100, 10 );

scene.add( gridHelper );

gridHelper.rotateX(Math.PI / 2);
// Lights

const sun = new THREE.DirectionalLight(0xffffed, 1);
sun.position.set(0,0,60);
sun.target.position.set(0,0,0);
scene.add(sun, sun.target);

const ambient = new THREE.AmbientLight(0xffffed, 0.1);
scene.add(ambient);

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

let targetQuarternion = new THREE.Quaternion();
const target = new THREE.Vector3(50,0,0)
let launch = false; 
let curve = new THREE.Curve();
window.addEventListener('keyup', async () => {
    if(!launch){
    await createPayload(modelGroup, sphereGroup);
    }
    launch = await true; 
    console.log(launch);
})

const createPayload = (modelGroup) => {
    const position = new THREE.Vector3();
    position.setFromMatrixPosition(modelGroup.matrixWorld)
    

    const geometry = new THREE.SphereGeometry( 1, 32, 32 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const lathe = new THREE.Mesh( geometry, material );
    lathe.name = "Lathe";
    lathe.position.set(position.x, position.y, position.z);
    lathe.lookAt(0,0,0);
    scene.add(lathe);

    let p1 = new THREE.Vector3();
    let p2 = new THREE.Vector3();
    let px = new THREE.Vector3();
    let py = new THREE.Vector3();
    let p = new THREE.Vector3();
    let p0 = position;
    let p3 = target;
    let angle = Math.abs(position.angleTo(target));
    if (angle > Math.PI/2){
        px.set(0, p0.y, p0 .z).normalize();
        py.copy(p3).normalize();
        p2.copy(px).multiplyScalar(40*angle/Math.PI);
        p1.copy(p0).add(p.copy(px).multiplyScalar(40*angle/Math.PI)).add(py.multiplyScalar(-5));
    }
    else{
        px.set(0, p0.y, p0 .z).normalize();
        py.copy(p3).normalize();
        p1.copy(px).multiplyScalar(30*(angle / (Math.PI/2))).add(p.copy(py).multiplyScalar(5));
        p2.copy(px).multiplyScalar(30*(angle / (Math.PI/2))).add(p.copy(py).multiplyScalar(30));
    }
    console.log(p0,p1,p2,p3)
    curve = new THREE.CubicBezierCurve3(p0,p1,p2,p3);
    // const points = curve.getPoints(50);
    // const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    // const curveObject = new THREE.Line(lineGeometry, material);
    // curveObject.name = 'Curve';
    // scene.add(curveObject);
}


/**
 * Animate
 */

const clock = new THREE.Clock()
let fraction = 0.01;

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //sphere.rotation.y = .5 * elapsedTime
 
    // Update Orbital Controls
    controls.update()

    sphereGroup.rotation.y = .5 *elapsedTime;
    //waterPlane.material.normalScale.set( Math.sin(elapsedTime), Math.cos(elapsedTime));
    waterSphere.material.normalScale.set( Math.sin(elapsedTime), Math.cos(elapsedTime));

    if(launch){
        let lathe = scene.getObjectByName('Lathe');
        // let curveObj = scene.getObjectByName('Curve');
        if(fraction<1){
            let newPosition = curve.getPoint(fraction);
            lathe.position.set(newPosition.x,newPosition.y,newPosition.z);
            fraction += 0.01;
        } else{
            fraction = 0;
            launch = false;
            scene.remove(lathe);
            // scene.remove(curveObj);
        }
    }
    


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()