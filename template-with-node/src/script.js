// Three.js スターターコード: 静物画 (果物・器・瓶・テーブル)

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// シーンの作成
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// カメラの設定
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

// レンダラーの設定
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// カメラ操作用のOrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// 環境光と平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// ---- オブジェクトの作成 ---- //

// テーブル
const tableGeometry = new THREE.BoxGeometry(10, 0.5, 10);
const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.y = -0.25;
scene.add(table);

// リンゴ（赤い球体）
const appleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const appleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const apple = new THREE.Mesh(appleGeometry, appleMaterial);
apple.position.set(-1, 0.5, 0);
scene.add(apple);

// ブドウ（小さな球体の集まり）
const grapeMaterial = new THREE.MeshStandardMaterial({ color: 0x6f2da8 });
for (let i = 0; i < 20; i++) {
  const grapeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const grape = new THREE.Mesh(grapeGeometry, grapeMaterial);
  const angle = (i / 20) * Math.PI * 2;
  const radius = 0.5;
  grape.position.set(
    Math.cos(angle) * radius + 1,
    0.4 + (i % 3) * 0.1,
    Math.sin(angle) * radius
  );
  scene.add(grape);
}

// レモン（黄色い楕円体）
const lemonGeometry = new THREE.SphereGeometry(0.4, 32, 32);
lemonGeometry.scale(1.2, 0.8, 0.8);
const lemonMaterial = new THREE.MeshStandardMaterial({ color: 0xfff44f });
const lemon = new THREE.Mesh(lemonGeometry, lemonMaterial);
lemon.position.set(0, 0.4, -1);
scene.add(lemon);

// 器（白いボウル）
const bowlGeometry = new THREE.CylinderGeometry(1.5, 1.8, 0.6, 32, 1, true);
const bowlMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial);
bowl.position.set(0, 0.3, 1.5);
bowl.rotation.x = Math.PI;
scene.add(bowl);

// 瓶（透明な円柱）
const bottleGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
const bottleMaterial = new THREE.MeshStandardMaterial({
  color: 0x88ccee,
  transparent: true,
  opacity: 0.5,
});
const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
bottle.position.set(2, 1, 0);
scene.add(bottle);

// ---- レンダリング ---- //
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
