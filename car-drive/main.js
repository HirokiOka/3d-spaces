import * as THREE from 'three';

// Basic Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Basic Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Basic Materials (Vaporwave Style)
const neonPink = new THREE.MeshStandardMaterial({ color: 0xff00ff, flatShading: true });
const neonBlue = new THREE.MeshStandardMaterial({ color: 0x00ffff, flatShading: true });

// Create Track (Floor with Grid Pattern)
const floorGeometry = new THREE.PlaneGeometry(500, 500, 10, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Create Low-poly Car Model
const carGeometry = new THREE.BoxGeometry(1, 0.5, 2); // Basic shape for car
const carBody = new THREE.Mesh(carGeometry, neonPink);
scene.add(carBody);

// Wheels
const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 8);
const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
const wheel2 = wheel1.clone();
const wheel3 = wheel1.clone();
const wheel4 = wheel1.clone();
wheel1.position.set(-0.5, -0.25, -0.75);
wheel2.position.set(0.5, -0.25, -0.75);
wheel3.position.set(-0.5, -0.25, 0.75);
wheel4.position.set(0.5, -0.25, 0.75);
[wheel1, wheel2, wheel3, wheel4].forEach(wheel => {
    wheel.rotation.z = Math.PI / 2;
    carBody.add(wheel);
});

// Set Camera Position
camera.position.set(0, 2, -5);

// Variables for Car Movement
let speed = 0;
const maxSpeed = 0.8;
const acceleration = 0.0001;
const friction = 0.98;
let turningAngle = 0;

// Jump-related variables
let isJumping = false;
let jumpSpeed = 0.2;
let jumpVelocity = 0;

// Key Controls
const keys = {};
document.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight', 'z', 'x', ' '].includes(event.key)) {
        event.preventDefault(); // Prevent default browser behavior
    }
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Update Car Position and Camera
function animate() {
    requestAnimationFrame(animate);

    // Acceleration and Friction
    if (keys['z']) speed = Math.min(speed - acceleration, -maxSpeed/2); // Accelerate with 'z' key
    if (keys['x']) speed = Math.max(speed + acceleration, maxSpeed); // Back with 'x' key
    speed *= friction;

    // Turning
    if (keys['ArrowLeft']) turningAngle += 0.03;
    if (keys['ArrowRight']) turningAngle -= 0.03;

    // Apply Movement
    carBody.rotation.y = turningAngle;
    carBody.position.x -= Math.sin(turningAngle) * speed;
    carBody.position.z -= Math.cos(turningAngle) * speed;

    // Jumping with Space key
    if (keys[' '] && !isJumping) {
        isJumping = true;
        jumpVelocity = jumpSpeed;
    }
    if (isJumping) {
        carBody.position.y += jumpVelocity;
        jumpVelocity -= 0.01; // Gravity effect

        // When car lands back on the ground
        if (carBody.position.y <= 0.5) {
            carBody.position.y = 0.5; // Reset height to ground level
            isJumping = false;
            jumpVelocity = 0;
        }
    }

    // Camera Follow with Delay
    const cameraOffset = new THREE.Vector3(0, 2, -5);
    camera.position.lerp(
        carBody.position.clone().add(cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), turningAngle)),
        0.1
    );
    camera.lookAt(carBody.position);

    // Render Scene
    renderer.render(scene, camera);
}

// Start Animation
animate();

window.addEventListener('keydown', (event) => {
  event.preventDefault();
});
