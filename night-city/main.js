import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// シーンの作成
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050522); // 夜空のような鮮やかな色

// カメラの設定
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);

// レンダラーの設定
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// コントロールの追加
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ライトの追加
const ambientLight = new THREE.AmbientLight(0x444488);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 20, 10);
scene.add(pointLight);

// ビル群の作成
const buildings = new THREE.Group();
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

for (let i = 0; i < 50; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const buildingMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        metalness: 0.3,
        roughness: 0.6
    });
    
    const geometry = new THREE.BoxGeometry(
        Math.random() * 2 + 1,  // 幅
        Math.random() * 10 + 5, // 高さ
        Math.random() * 2 + 1   // 奥行き
    );
    
    const building = new THREE.Mesh(geometry, buildingMaterial);
    building.position.set(
        (Math.random() - 0.5) * 40, // X座標
        geometry.parameters.height / 2, // 高さの半分（地面から生える）
        (Math.random() - 0.5) * 40  // Z座標
    );
    
    // 窓を追加
    const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffcc,
        emissive: 0xffffcc,
        emissiveIntensity: 1.0
    });
    for (let j = 0; j < 5; j++) {
        for (let k = 0; k < 3; k++) {
            const windowGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.02);
            const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
            windowMesh.position.set(
                building.position.x + (Math.random() - 0.5) * 1.5,
                building.position.y - j * 1.5 + 3,
                building.position.z + 1.01
            );
            buildings.add(windowMesh);
        }
    }
    
    buildings.add(building);
}
scene.add(buildings);

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// リサイズ対応
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
