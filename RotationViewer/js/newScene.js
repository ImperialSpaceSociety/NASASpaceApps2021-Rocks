import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';

//Model List Paths
const MODELS = [
    {
        path: '../3DModels/Cube.glb',
        name: 'Cube',
        scalefactor: 3
    },
    {
        path: '../3DModels/Duck.glb',
        name: 'Duck',
        scalefactor: 3.5
    },
    {
        path: '../3DModels/Fish.glb',
        name: 'Fish',
        scalefactor: 5
    },
    {
        path: '../3DModels/HW1_Asteroid.glb',
        name: 'HW1',
        scalefactor: 6
    },
    {
        path: '../3DModels/Pyramid.glb',
        name: 'Pyramid',
        scalefactor: 4
    },
    {
        path: '../3DModels/Roadster.glb',
        name: 'Roadster',
        scalefactor: 3
    },
    {
        path: '../3DModels/Sphere.glb',
        name: 'Sphere',
        scalefactor: 4
    },
    {
        path: '../3DModels/Teapot.glb',
        name: 'Teapot',
        scalefactor: 4.5
    },
];

//Initial Definitions
let ModListLen = MODELS.length;
let scene, camera, renderer, model;
let width = window.innerWidth;
let height = window.innerHeight;
let modelnum = 0;
let thingLoader, texLoader;

// const canvas = document.getElementById("canvas");
// const canvasctx = canvas.getContext("2d");

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width,height);
    document.body.appendChild( renderer.domElement );

    thingLoader = new GLTFLoader();
    texLoader = new THREE.TextureLoader();

    document.addEventListener("keypress", function onEvent(event) {
        if (event.code === 'Space'){
            removeThing(model);
            console.log("Key Pressed")
            if (modelnum <= ModListLen - 2){
                modelnum += 1;
            }
            else{
                modelnum = 0;
            }
            addThing(modelnum);
        }
    })

    document.addEventListener("click", function onEvent(event) {
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        console.log(mouseX, mouseY);
    })

    setScene();
    addThing(modelnum);
    animate();
    pixelData();
};

function animate(){
    requestAnimationFrame( animate );
    transforms(model, 0.01, 0.01);
    renderer.render(scene, camera);
};

function setScene(){
    //set background
    texLoader.load('./stars.jpg', function(texture){
        scene.background = texture;
        });

    //set lighting
    const light = new THREE.DirectionalLight(0xffffff, 5);
    scene.add(light);

    //initial camera
    setCamera(0,0,5);
};

function setCamera(Xpos,Ypos,Zpos){
    camera.position.x = Xpos;
    camera.position.y = Ypos;
    camera.position.z = Zpos;
};

function addThing(number){
    thingLoader.load(MODELS[number].path, function (gltf) {
        model = gltf.scene;
        var sf = MODELS[number].scalefactor;
        model.scale.set(sf,sf,sf);
        scene.add(model);
    })
};

function removeThing(item){
    scene.remove(item);
};

function transforms(item, xRot = 0, yRot = 0, zRot = 0, xTra = 0, yTra = 0, zTra = 0){
    item.rotation.x += xRot;
    item.rotation.y += yRot;
    item.rotation.z += zRot;
    item.position.x += xTra;
    item.position.y += yTra;
    item.position.z += zTra;
};

function pixelData(){

};

init();
