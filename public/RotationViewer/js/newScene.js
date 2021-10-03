import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import {GLTFLoader} from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';

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
        scalefactor: 3
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
let scene, camera, renderer, model, data, temp;
let width = document.getElementById('rtxCanvas').clientWidth;
let height = document.getElementById('rtxCanvas').clientHeight;
let modelnum = 0;
let counter = 0;
let thingLoader, texLoader;
let dataGap = 5;
let x, y, z;
let angle = Math.PI / 3;
let oldAngle = angle;

const fac = new FastAverageColor();

let xrot = 0.01;
let yrot = 0.0;
let zrot = 0.0;
let fudgefactor = 0.1;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.getElementById("rtxCanvas").appendChild(renderer.domElement);

    thingLoader = new GLTFLoader();
    texLoader = new THREE.TextureLoader();

    // document.addEventListener("keypress", function onEvent(event) {
    //     if (event.code === 'Space'){
    //         removeThing(model);
    //         console.log("New model")
    //         if (modelnum <= ModListLen - 2){
    //             modelnum += 1;
    //         }
    //         else{
    //             modelnum = 0;
    //         }
    //         addThing(modelnum);
    //     }
    // })

    // document.addEventListener("click", function onEvent(event) {
    //     let mouseX = event.clientX;
    //     let mouseY = event.clientY;
    //     console.log(mouseX, mouseY);
    //
    //     removeThing(model);
    //         console.log("New model")
    //         if (modelnum <= ModListLen - 2){
    //             modelnum += 1;
    //         }
    //         else{
    //             modelnum = 0;
    //         }
    //         addThing(modelnum);
    // });


    setScene();
    addThing(modelnum);
    animate();
};

function animate() {
    requestAnimationFrame(animate);
    transforms(model, xrot, yrot, zrot);
    renderer.render(scene, camera);
    counter++;

    if (counter == dataGap) {
        data = renderer.domElement.toDataURL();
        //console.log(data);
        counter = 0;
        pngProcess(data);
    }
};

function setScene() {
    //set background
    texLoader.load('RotationViewer/stars.jpg', function (texture) {
        scene.background = texture;
    });

    //set lighting
    const light = new THREE.DirectionalLight(0xffffff, 5);
    positionSun(light, angle)
    scene.add(light);

    //initial camera
    setCamera(0, 0, 5);

    let delta;
    document.addEventListener("wheel", function onEvent(event) {

        if (event.deltaY > 0) {
            angle += 0.3;
        } else {
            angle -= 0.3;
        }
        ;
        // console.log(angle);
        positionSun(light, angle);
    });
};

function positionSun(l, alpha) {
    x = Math.sin(alpha);
    y = 0;
    z = Math.cos(alpha);

    l.position.set(x, y, z)
};

function setCamera(Xpos, Ypos, Zpos) {
    camera.position.x = Xpos;
    camera.position.y = Ypos;
    camera.position.z = Zpos;
};

function addThing(number) {
    thingLoader.load(MODELS[number].path, function (gltf) {
        model = gltf.scene;
        var sf = MODELS[number].scalefactor;
        model.scale.set(sf, sf, sf);
        console.log('addThing');
        console.log(model);
        scene.add(model);
    })
};

function removeThing(item) {
    scene.remove(item);
};

function transforms(item, xRot = 0, yRot = 0, zRot = 0, xTra = 0, yTra = 0, zTra = 0) {
    item.rotation.x += xRot;
    item.rotation.y += yRot;
    item.rotation.z += zRot;
    item.position.x += xTra;
    item.position.y += yTra;
    item.position.z += zTra;
};


window.rotationUpdate = function (outID, inID) {
    console.log("Rotation update");
    document.getElementById(outID).innerHTML = (parseFloat(document.getElementById(inID).value) / 1000 - 0.5).toPrecision(2) + " rad/s";

    if (inID == "omegaX") {
        xrot = (parseFloat(document.getElementById(inID).value) / 1000 - 0.5) * fudgefactor;
    } else if (inID == "omegaY") {
        yrot = (parseFloat(document.getElementById(inID).value) / 1000 - 0.5) * fudgefactor;
    } else if (inID == "omegaZ") {
        zrot = (parseFloat(document.getElementById(inID).value) / 1000 - 0.5) * fudgefactor;
    }
}

window.buttonUpdate = function (buttonID) {
    console.log("Button update");
    removeThing(model);

    if (buttonID == "Asteroid") {
        modelnum = 3;
    } else if (buttonID == "Tesla") {
        modelnum = 5;
    } else if (buttonID == "Duck") {
        modelnum = 1;
    } else if (buttonID == "Cycle") {
        console.log("Key Pressed")
        if (modelnum <= ModListLen - 2) {
            modelnum += 1;
        } else {
            modelnum = 0;
        }

    }
    addThing(modelnum);
}

function pngProcess(image) {
    fac.getColorAsync(image).then(color => {
        // console.log(color.rgb);
        let valStr = color.rgb;
        temp = valStr.split('(');
        valStr = temp[1];
        temp = valStr.split(')');
        valStr = temp[0];
        temp = valStr.split(',')
        temp = temp.map((i) => Number(i));
        temp = temp[0] + temp[1] + temp[2]
        addPoint(temp);
    })
};

init();
