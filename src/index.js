import {initChart, updateChart} from './drawChart';
import FastAverageColor from 'fast-average-color';

initChart();

const fac = new FastAverageColor();

window.updateChart = dataURL => {
    /*const reader = new FileReader();
    reader.addEventListener('loadend', () => {
        const array = new Uint8Array(reader.result);
        const brightness = array.reduce((acc, val) => acc + val);
        updateChart(brightness);
    });
    reader.readAsArrayBuffer(blob);*/

    fac.getColorAsync(dataURL).then(color => {
        // console.log(color.rgb);
        let valStr = color.rgb;
        let temp = '';
        temp = valStr.split('(');
        valStr = temp[1];
        temp = valStr.split(')');
        valStr = temp[0];
        temp = valStr.split(',')
        temp = temp.map((i) => Number(i));
        temp = temp[0] + temp[1] + temp[2]
        updateChart(temp);
    })
};

const MODEL_PATH = '../3DModels/Roadster.glb';
const TICKS_LIMIT = 200;
const ROTATION_STEP = 0.1;
let currentModelLoaded = null;
let currentEnvLight = null;

const renderer = new THREE.RayTracingRenderer({ticksLimit: TICKS_LIMIT});

renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.setPixelRatio(1.0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.toneMappingWhitePoint = 5;

renderer.renderWhenOffFocus = false;
renderer.renderToScreen = true;

renderer.domElement.id = 'renderer-canvas';
const canvasContainer = document.getElementById('rtxCanvasContainer');
canvasContainer.appendChild(renderer.domElement);

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

let animationFrameId;
let ticks = 0;
let rotation = 0;

const tick = async (time) => {
    ticks++;
    controls.update();
    camera.position.set(0, 2, 0);
    renderer.sync(time);
    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(tick);

    if (ticks > TICKS_LIMIT) {
        rotation += ROTATION_STEP;
        if (rotation > Math.PI) {
            rotation = Math.PI - rotation;
        }
        ticks = 0;
        cancelAnimationFrame(animationFrameId);
        loadModel();
    }
};

function load(loader, url) {
    return new Promise(resolve => {
        const l = new loader();
        l.load(url, resolve, undefined, exception => { throw exception; });
    });
}

async function createModelFromPath(path) {
    const gltfData = await load(THREE.GLTFLoader, path);
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

    // TODO: Why do we need this?
    // controls.target.set(centroid);
    //camera.position.set(0, (bounds.max.y - bounds.min.y) * 0.75, distance * 2.0);
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
    const model = await createModelFromPath(MODEL_PATH);
    updateSceneWithModel(model);
}

async function loadEnvironmentMap(path) {
    const loadPromise = new Promise((resolve) =>
        new THREE.RGBELoader().load(path, (environmentMapTexture) =>
            resolve(environmentMapTexture),
        ),
    );

    const environmentMap = await loadPromise;
    environmentMap.encoding = THREE.LinearEncoding;

    return environmentMap;
}

async function selectEnvMapFromName() {
    //TODO: how to remove calls to loadEnvironmentMap?
    console.log('selectEnvMapFromName');
    const path = '../envmaps/gray-background-with-dirlight.hdr';
    const d = new Date();
    const start = d.getTime();
    const envMap = await loadEnvironmentMap(path);
    const envMap2 = await loadEnvironmentMap(path);
    const envMap3 = await loadEnvironmentMap(path);
    const d2 = new Date();
    const end = d2.getTime();
    console.log('duration: ' + (end - start));
    //const envMap = await loadEnvironmentMap(envMapEntry.path);
    const envLight = new THREE.EnvironmentLight(envMap);
    //const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    //directionalLight.position.set(0, 3, 0);
    //scene.add(envLight);

    if (currentEnvLight) scene.remove(currentEnvLight);
    scene.add(envLight);
    currentEnvLight = envLight;

    renderer.needsUpdate = true;
}

async function init() {
    window.addEventListener('resize', resize);
    resize();

    selectEnvMapFromName();

    loadModel();

    scene.add(camera);

    THREE.DefaultLoadingManager.onLoad = tick;
}

init();
