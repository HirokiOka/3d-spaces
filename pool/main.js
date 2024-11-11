import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Reflector } from "three/addons/objects/Reflector.js";

const floorColor = 0xf7f6f5;
const flamingoColor = 0xfc8eac;
const purpleColor = 0xe090df;
const skyblueColor = 0x02ccfe;

const scene = new THREE.Scene();
scene.background = new THREE.Color(skyblueColor);
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

const tileTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/grid.png');
tileTexture.wrapS = tileTexture.wrapT = THREE.RepeatWrapping;
tileTexture.repeat.set(18, 18);

const floorGeometry = new THREE.BoxGeometry(14, 0.5, 12);
const floorTopMaterial = new THREE.MeshBasicMaterial({
  map: tileTexture,
  color: floorColor
});
const floorSideMaterial = new THREE.MeshBasicMaterial({ color: 0xd3d3d3 });

const floorMaterials = [
    floorSideMaterial,
    floorSideMaterial,
    floorTopMaterial, 
    floorSideMaterial,
    floorSideMaterial,
    floorTopMaterial,
];
const floor = new THREE.Mesh(floorGeometry, floorMaterials);
floor.position.y = -0.25;
scene.add(floor);

const poolGeometry = new THREE.PlaneGeometry(8, 8);
const poolMaterial = new THREE.MeshBasicMaterial({
  color: skyblueColor,
  side: THREE.DoubleSide
});

const pool = new THREE.Mesh(poolGeometry, poolMaterial);
pool.rotation.x = -Math.PI / 2; 
pool.position.y = 0.4; 
scene.add(pool);

const waterGeometry = new THREE.PlaneGeometry(8, 8);
const waterReflector = new Reflector(waterGeometry, {
    color: new THREE.Color(0x48dafe),
    textureWidth: 512,
    textureHeight: 512,
});
waterReflector.rotation.x = -Math.PI / 2;
waterReflector.position.y = 0.105;
scene.add(waterReflector);


const poolWallThickness = 0.2;
const poolWallMaterial = new THREE.MeshBasicMaterial({
  color: flamingoColor,
});

const poolWallFrontBackGeometry = new THREE.BoxGeometry(8, 1, poolWallThickness);

const poolWallFront = new THREE.Mesh(poolWallFrontBackGeometry, poolWallMaterial);
poolWallFront.position.set(0, 0.5, 4);
scene.add(poolWallFront);

const poolWallBack = new THREE.Mesh(poolWallFrontBackGeometry, poolWallMaterial);
poolWallBack.position.set(0, 0.5, -4);
scene.add(poolWallBack);

const poolWallSideGeometry = new THREE.BoxGeometry(poolWallThickness, 1, 8);

const poolWallLeft = new THREE.Mesh(poolWallSideGeometry, poolWallMaterial);
poolWallLeft.position.set(-4, 0.5, 0);
scene.add(poolWallLeft);

const poolWallRight = new THREE.Mesh(poolWallSideGeometry, poolWallMaterial);
poolWallRight.position.set(4, 0.5, 0);
scene.add(poolWallRight);
const cylinderGeometry = new THREE.CylinderGeometry(0.8, 0.8, 6, 16);
const cylinderMaterial = new THREE.MeshBasicMaterial({
  color: floorColor,
  map: tileTexture,
}); 

const backLeftCylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
backLeftCylinder.position.set(-5.5, 3.0, -4.2);
scene.add(backLeftCylinder);
const backRightCylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
backRightCylinder.position.set(5.5, 3.0, -4.2);
scene.add(backRightCylinder);

const frontLeftCylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
frontLeftCylinder.position.set(-5.5, 3.0, 4.2);
scene.add(frontLeftCylinder);
const frontRightCylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
frontRightCylinder.position.set(5.5, 3.0, 4.2);
scene.add(frontRightCylinder);

const loader = new GLTFLoader();
const duckGltf = await loader.loadAsync('./model/Duck/glTF/Duck.gltf');
const duck = duckGltf.scene;
duck.position.set(0, 0.1, 0);
duck.rotation.y = - Math.PI / 4;
scene.add(duck);

const radius = 10;
camera.position.set(radius, 4, 0);
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.003;
    camera.position.x = radius * Math.cos(time * 0.1);
    camera.position.z = radius * Math.sin(time * 0.1);
    camera.lookAt(0, 0, 0);
    duck.position.y = 0.15 + Math.sin(Date.now() * 0.004) * 0.05;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
