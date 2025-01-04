import * as THREE from 'three';

// Basic Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Create Grid-like Terrain
const gridWidth = 100;
const gridDepth = 200;
const gridSegments = 80;
const terrainGeometry = new THREE.PlaneGeometry(gridWidth, gridDepth, gridSegments, gridSegments);

// Adjust vertices for a wavy terrain effect
const positionAttribute = terrainGeometry.attributes.position;
for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = Math.sin(x * 0.5) * 2 + Math.cos(y * 0.5) * 2; // Wave-like deformation
    positionAttribute.setZ(i, z);
}
terrainGeometry.computeVertexNormals();

const terrainMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true
});
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

// Background Sunset Effect
const sunsetGeometry = new THREE.CircleGeometry(50, 32);
const sunsetMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide });
const sunset = new THREE.Mesh(sunsetGeometry, sunsetMaterial);
sunset.position.set(0, 30, 100);
scene.add(sunset);

// Car Placeholder
const carGeometry = new THREE.BoxGeometry(1, 0.5, 2); // Simple shape for car
const carMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.y = 1;
scene.add(car);

// Set Camera Position
camera.position.set(0, 5, -10);
camera.lookAt(car.position);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Move the terrain backwards to create an endless road effect
    terrain.position.z -= 0.2;
    if (-gridDepth / 3 >= terrain.position.z) {
        terrain.position.z = 0;
    }

    // Render Scene
    renderer.render(scene, camera);
}

// Start Animation
animate();

window.document.addEventListener('keydown', (event) => {
  event.preventDefault();
});
