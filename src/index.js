const TICKS_PER_ROTATION = 200;
const ROTATION_STEP = 0.1;

const INITIAL_MODEL_DATA = {
    path: 'https://models.babylonjs.com/CornellBox/cornellBox.glb',
    name: 'Cornell Box',
    license: 'https://creativecommons.org/licenses/by/4.0/',
};

let currentModelLoaded = null;
let currentLight = null;

let animationFrameId;
let ticks = 0;
let rotation = 0;

const renderer = new THREE.RayTracingRenderer({ticksPerRotation: TICKS_PER_ROTATION});

renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.setPixelRatio(1.0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.toneMappingWhitePoint = 5;

renderer.renderWhenOffFocus = false;
renderer.renderToScreen = true;

document.body.appendChild(renderer.domElement);

const camera = new THREE.LensCamera();
camera.fov = 35;
camera.aperture = 0.01;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;

const scene = new THREE.Scene();

function resize() {
    if (renderer.domElement.parentElement) {
        const width = renderer.domElement.parentElement.clientWidth;
        const height = renderer.domElement.parentElement.clientHeight;
        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

const tick = (time) => {
    ticks++;
    controls.update();
    camera.position.set(0, 20, 0);

    if (ticks > TICKS_PER_ROTATION) {
        rotation += ROTATION_STEP;
        ticks = 0;
        cancelAnimationFrame(animationFrameId);
        loadModel();
    }

    renderer.sync(time);
    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(tick);

};

function load(loader, url) {
    return new Promise(resolve => {
        const l = new loader();
        l.load(url, resolve, undefined, exception => { throw exception; });
    });
}

async function createModelFromData(data) {
    const gltfData = await load(THREE.GLTFLoader, data.path);
    const gltfScene = gltfData.scene;

    return gltfScene;
}

function computeBoundingBoxFromModel(model) {
    const bounds = new THREE.Box3();
    bounds.setFromObject(model);
    return bounds;
}

function updateCameraFromModel(camera, model) {
    const bounds = computeBoundingBoxFromModel(model);
    const centroid = new THREE.Vector3();
    bounds.getCenter(centroid);

    const distance = bounds.min.distanceTo(bounds.max);

    camera.aperture = 0.01 * distance;

    controls.target.copy(centroid);
    controls.update();
}

function updateSceneWithModel(model) {
    if (currentModelLoaded) {
        currentModelLoaded.parent.remove(currentModelLoaded);
    }
    model.rotation.set(rotation, 0, 0);
    scene.add(model);
    renderer.needsUpdate = true;
    currentModelLoaded = model;
    updateCameraFromModel(camera, model);
}

async function loadModel() {
    const model = await createModelFromData(INITIAL_MODEL_DATA);
    updateSceneWithModel(model);
}

function addDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    scene.add(directionalLight);

    if (currentLight) scene.remove(currentLight);
    scene.add(directionalLight);
    currentLight = directionalLight;

    renderer.needsUpdate = true;
}

async function init() {
    window.addEventListener('resize', resize);
    resize();

    addDirectionalLight();
    loadModel();

    scene.add(camera);
    THREE.DefaultLoadingManager.onLoad = tick;
}

init();
