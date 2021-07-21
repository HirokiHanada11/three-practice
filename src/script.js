import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//group
const modelGroup = new THREE.Group();

// Objects

const planeGeometry = new THREE.PlaneGeometry( 100, 50 );
let loader = new THREE.TextureLoader();
loader.load(
    "./textures/world-map-world-map-in-grey-hd-png.png",
    (texture) => {
        let planeMaterial = new THREE.MeshBasicMaterial( {map: texture} );
        let plane = new THREE.Mesh( planeGeometry, planeMaterial );
        scene.add( plane );
    },
    undefined,
    (err) => {console.error(err)}
);

const geometry = new THREE.SphereGeometry( 1, 32, 32 );
const cylinderGeometry = new THREE.CylinderGeometry( 1.2, 0.2, 3, 32);

//loading 3D models
const fbxLoader = new FBXLoader()
fbxLoader.load(
    'models/xbot.fbx',
    (object) => {
        object.scale.set(.05, .05, .05)
        object.rotateX(Math.PI / 2)
        modelGroup.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)



// Materials

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0xff0000)



// Mesh
const sphere = new THREE.Mesh(geometry,material)
const cylinder = new THREE.Mesh(cylinderGeometry,material)
cylinder.position.z = 2;
cylinder.rotateX(- Math.PI / 2)
sphere.position.z = 4;
modelGroup.add(cylinder)
modelGroup.add(sphere)

gui.add(modelGroup.position, 'x').min(-50).max(50).step(1);
gui.add(modelGroup.position, 'y').min(-25).max(25).step(1);

scene.add(modelGroup);


//grid
const gridHelper = new THREE.GridHelper( 100, 10 );

scene.add( gridHelper );

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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
camera.position.y = -20;
camera.lookAt(0,0,0);
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()