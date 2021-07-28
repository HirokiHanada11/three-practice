import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as dat from 'dat.gui'
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { PointsMaterial, SphereGeometry } from 'three'

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


const sphereGeometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
const cylinderGeometry = new THREE.CylinderBufferGeometry( 1.2, 0.2, 3, 32);

// Materials

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)

const modelGroup = new THREE.Group();

// Mesh
const sphere = new THREE.Mesh(sphereGeometry,material)
const cylinder = new THREE.Mesh(cylinderGeometry,material)
sphere.position.z = -4;
cylinder.position.z = -2;
cylinder.rotateX(Math.PI / 2)
modelGroup.add(cylinder)
modelGroup.add(sphere)
modelGroup.position.setFromSphericalCoords(20,Math.PI/3,-Math.PI/4); //(radius, phi, theta) phi: yz plane theta: xz plane 
modelGroup.lookAt(0,0,0);

sphereGroup.add(modelGroup);


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

const pointLight = new THREE.PointLight(new THREE.Color("#a7d8de"),0.5);
pointLight.name = "Lathe";
scene.add(pointLight);

const alphaMap = loader.load("./textures/alpha-map.png")
const createPayload = (modelGroup) => {
    const position = new THREE.Vector3();
    position.setFromMatrixPosition(modelGroup.matrixWorld)
    
    // const geometry = new THREE.SphereBufferGeometry( 0.2, 8, 8 );
    // const material = new THREE.MeshStandardMaterial( { color: new THREE.Color("#a7d8de"), } );
    // const lathe = new THREE.Mesh( geometry, material );
    // lathe.name = "Lathe";
    

    const tarilGeometry = new THREE.CylinderBufferGeometry(0.2,0.7, 1, 8, 8, false);
    // const trailMaterial = new THREE.MeshStandardMaterial( { color: new THREE.Color("#85b0bd"), emissiveIntensity: 0.5} );
    // const trail = new THREE.Mesh( tarilGeometry, trailMaterial );
    const trailMaterial = new PointsMaterial({size:0.0005}) 
    const trail = new THREE.Points(tarilGeometry, trailMaterial);

    const tarilGeometry2 = new THREE.CylinderBufferGeometry(0.4,0.1, 3.5, 8, 8, false);
    // const trailMaterial2 = new THREE.MeshStandardMaterial( { color: new THREE.Color("#85b0bd") } );
    // const trail2 = new THREE.Mesh( tarilGeometry2, trailMaterial2 );
    const trailMaterial2 = new PointsMaterial({size:0.0005}) 
    const trail2 = new THREE.Points(tarilGeometry2, trailMaterial2);
    trail2.position.y = -2;

    const trailGroup = new THREE.Group();
    trailGroup.name = "Trail";
    trailGroup.add(trail);
    trailGroup.add(trail2);

    pointLight.position.set(position.x, position.y, position.z); 
    trailGroup.position.set(position.x, position.y, position.z);

    // scene.add(lathe);
    scene.add(trailGroup);

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
let fraction = 0.03;
const up = new THREE.Vector3(0,1,0);
const axis = new THREE.Vector3();

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
        let trail = scene.getObjectByName('Trail');
        // let curveObj = scene.getObjectByName('Curve');
        if(fraction<1){
            let newPosition = curve.getPoint(fraction);
            lathe.position.copy(newPosition);
            
            const tangent = curve.getTangent(fraction-0.02); 
            const radians = up.angleTo(tangent);
            axis.crossVectors(up,tangent).normalize();
            let trailPosition = curve.getPoint(fraction-0.02);
            trail.position.copy(trailPosition);
            trail.quaternion.setFromAxisAngle(axis,radians);
            fraction += 0.01;
        } else{
            fraction = 0.03;
            launch = false;
            lathe.position.set(0,0,0);
            scene.remove(trail);
            // scene.remove(curveObj);
        }
    }
    


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()