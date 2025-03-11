import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, composer;
let grid;
let stars = [];
let pyramid, cylinder, rightSideWall, piller;
let boxes = [];
let secondFloor;
let sphere;
let torus;

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x670096);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(1, 2, 25);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Grid geoometry
  const gridGeometry = new THREE.PlaneGeometry(50, 50, 50, 10);
  const gridMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            void main() {
                float xLine = mod(vUv.x * 10.0 + time * 1.5, 1.0) < 0.05 ? 1.0 : 0.0;
                float yLine = mod(vUv.y * 10.0 + time * 1.5, 1.0) < 0.05 ? 1.0 : 0.0;
                float grid = xLine + yLine;

                vec3 neonColor = mix(vec3(0.0, 1.0, 1.0), vec3(1.0, 0.0, 1.0), sin(vUv.y * 10.0 + time) * 0.5 + 0.5);
                
                gl_FragColor = vec4(neonColor * grid, grid * 0.9);
            }
        `,
        transparent: true
    });

    grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    scene.add(grid);

  //Sun Pedestal
  const pedestalGeometry = new THREE.CylinderGeometry(10, 10, 2, 5);
  const pedestalMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal.position.set(0, -2, -10);
  scene.add(pedestal);

  // Second floor
  const secondFloorGeometry = new THREE.BoxGeometry(40, 1, 20);
  const secondFloorMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  secondFloor = new THREE.Mesh(secondFloorGeometry, secondFloorMaterial);
  secondFloor.position.set(3, 16, -14);
  scene.add(secondFloor);

  // Pole
  const poleGeometry = new THREE.CylinderGeometry(1.0, 1.0, 12, 10);
  const poleMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  const poleTwo = new THREE.Mesh(poleGeometry, poleMaterial);
  const poleTwoX = -14;
  const poleTwoY = 4;
  const poleTwoZ = 4;
  poleTwo.position.set(poleTwoX, poleTwoY, poleTwoZ);
  scene.add(poleTwo);
  
  // Spehre
  const sphereGeometry = new THREE.SphereGeometry(1.7, 12, 12);
  const sphereMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(poleTwoX, poleTwoY + 9, poleTwoZ);
  scene.add(sphere);

  // Torus
  const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
  const torusMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.set(12, 6, 15);
  torus.rotation.x = Math.PI / 4;
  scene.add(torus);

  //Floating geometries
  const pyramidGeometry = new THREE.ConeGeometry(4, 6, 4);
  const pyramidMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
  pyramid.position.set(-10, -2, 8);
  pyramid.rotation.z = Math.PI / 2;
  scene.add(pyramid);

  const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 70, 10, 4, false);
  const cylinderMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.position.set(12, 18, -15);
  cylinder.rotation.x = -Math.PI / 4;
  scene.add(cylinder);

  // Box
  const boxGeometry = new THREE.BoxGeometry(0.8, 14, 14);
  const boxMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  rightSideWall = new THREE.Mesh(boxGeometry, boxMaterial);
  rightSideWall.position.set(14, 2, 9);
  scene.add(rightSideWall);

  // 2F Boxes
  const boxesGeometry = new THREE.BoxGeometry(3, 2, 2);
  const boxesMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  for (let i = 0; i < 4; i++) {
    const box = new THREE.Mesh(boxesGeometry, boxesMaterial);
    box.position.set(i * 4 - 15, 18, -4);
    box.rotation.y = Math.PI / 4 * i;
    scene.add(box);
    boxes.push(box);
  }

  const pillerGeometry = new THREE.BoxGeometry(4, 20, 3);
  const pillerMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
  piller = new THREE.Mesh(pillerGeometry, pillerMaterial);
  piller.position.set(-16, 2, 13);
  scene.add(piller);

  // Lights
  const pinkLight = new THREE.PointLight(0xff00ff, 3, 50);
  pinkLight.position.set(5, 5, 5);
  scene.add(pinkLight);

  const blueLight = new THREE.PointLight(0x00ffff, 3, 50);
  blueLight.position.set(-5, 5, -5);
  scene.add(blueLight);

  // Post-processing
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    2.0, 0.8, 0.85
  );
  composer.addPass(bloomPass);

  window.addEventListener('resize', onWindowResize);
}

// Sun
function createRetroSun() {
  // Create canvas for the sun
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 128;

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'Bold 84px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('広告募集中', canvas.width / 2, canvas.height / 2);

  const textTexture = new THREE.CanvasTexture(canvas);
  textTexture.needsUpdate = false;

  const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: false });
  const textGeometry = new THREE.PlaneGeometry(8, 2); 
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  textMesh.position.set(0, 6, 1);
  scene.add(textMesh);

  const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
  const sunMaterial = new THREE.ShaderMaterial({
      uniforms: {
          color1: { value: new THREE.Color(0x00ffff) },
          color2: { value: new THREE.Color(0xff00ff) },
      },
      vertexShader: `
          varying vec2 vUv;
          void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
      fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec2 vUv;
          void main() {
              vec3 gradient = mix(color1, color2, vUv.y); // 上下のグラデーション
              gl_FragColor = vec4(gradient, 1.0);
          }
      `,
  });

  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(0, 8, -10);
  scene.add(sun);

}

createRetroSun();

// Stars
const starCount = 700;
const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.2,
    transparent: true,
});

const star = new THREE.Points(starGeometry, starMaterial);
stars.push(star);
scene.add(star);


function animate() {

  requestAnimationFrame(animate);

  grid.material.uniforms.time.value += 0.008;
  pyramid.rotation.y -= 0.01;
  pyramid.rotation.z += 0.01;
  sphere.rotation.y -= 0.01;
  torus.rotation.y -= 0.01;
  cylinder.rotation.y -= 0.004;

  composer.render();
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
