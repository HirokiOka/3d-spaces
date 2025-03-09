import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, composer;
let grid, floatingObjects = [];

init();
animate();

function init() {
    // **シーンの作成**
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011); // 暗い背景

    // **カメラ設定**
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    // **レンダラー設定**
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // **コントロール（デバッグ用）**
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // **🌌 ネオンカラーの無限グリッドの床**
    const gridGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
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

    // **🔮 浮遊する幾何学オブジェクト**
    const geometries = [
        new THREE.TorusGeometry(1, 0.3, 16, 100),
        //new THREE.TorusKnotGeometry(1, 0.3, 100, 16),
        new THREE.DodecahedronGeometry(2),
        new THREE.SphereGeometry(2, 32, 32),
    ];

    for (let i = 0; i < 6; i++) {
        const material = new THREE.MeshNormalMaterial({ 
          flatShading: true,
        });
        const object = new THREE.Mesh(geometries[Math.floor(Math.random() * geometries.length)], material);
        object.position.set(Math.random() * 20 - 5, Math.random() * 5 + 2, Math.random() * -10);
        scene.add(object);
        floatingObjects.push(object);
    }

    // **💡 ネオン風のライティング**
    const pinkLight = new THREE.PointLight(0xff00ff, 3, 50);
    pinkLight.position.set(5, 5, 5);
    scene.add(pinkLight);

    const blueLight = new THREE.PointLight(0x00ffff, 3, 50);
    blueLight.position.set(-5, 5, -5);
    scene.add(blueLight);

    // **✨ ポストプロセス (Bloomエフェクト)**
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);

    // **ウィンドウリサイズ対応**
    window.addEventListener('resize', onWindowResize);
}

// 🌅 太陽の追加
function createRetroSun() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    // 背景透明、フォントの設定
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'Bold 100px sans-serif';
    ctx.fillStyle = '#000000'; // 黄色系のネオンカラー
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('広告募集中', canvas.width / 2, canvas.height / 2);

    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.needsUpdate = true;
    // **3️⃣ Plane に貼り付ける**
    const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
    const textGeometry = new THREE.PlaneGeometry(8, 2); // 太陽に合うサイズ
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // **4️⃣ 太陽の前に配置**
    textMesh.position.set(0, 8, -10); // 太陽のちょっと前
    scene.add(textMesh);

    const sunGeometry = new THREE.SphereGeometry(6, 32, 32);
    const sunMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color1: { value: new THREE.Color(0xff00ff) },
            color2: { value: new THREE.Color(0x00ffff) },
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
    sun.position.set(0, 8, -20); // 奥に配置
    scene.add(sun);

}

// 🌞 太陽を追加
createRetroSun();
function animate() {
    requestAnimationFrame(animate);

    // **時間を進める（グリッドスクロール）**
    grid.material.uniforms.time.value += 0.008;

    // **幾何学オブジェクトを回転＆浮遊**
    floatingObjects.forEach((obj, index) => {
        obj.rotation.x += 0.01 * index;
        obj.rotation.y += 0.001 * index;
        obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.02;
    });

    // **レンダリング**
    composer.render();
}

// **ウィンドウリサイズ処理**
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
