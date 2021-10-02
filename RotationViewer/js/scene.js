import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';

var modelnum = 5;
let width = window.innerWidth;
let height = window.innerHeight;

//Model List
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

function init() {
    // Creating the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    //set background
    const backloader = new THREE.TextureLoader();
    backloader.load('./stars.jpg', function(texture){
        scene.background = texture; 
    })

    // Temporary Light
    const light = new THREE.PointLight(0xffffff, 5, 10e13);
    light.position.set(0,10e3,0);
    scene.add(light);

    // Loader
    const thingLoader = new GLTFLoader();
    
    thingLoader.load(MODELS[modelnum].path, function (gltf) {
        var model = gltf.scene;
        var sf = MODELS[modelnum].scalefactor;
        model.scale.set(sf,sf,sf);
        scene.add(model);

    
        // Animate the scene
        function animate() {
            requestAnimationFrame( animate );
            model.rotation.x += 0.005;
            model.rotation.y += 0.01;
            // model.rotation.z += 0.01;
            renderer.render( scene, camera );

            // let gl = WebGLRenderingContext;
            // let value = new Uint8Array(width * height * 4);
            
            // gl.readPixels(0,0,width,height, gl.RGBA, gl.FLOAT, value);
            // console.log(value);
    }
    animate();
    } )

    camera.position.z = 5;


    
}

init();


