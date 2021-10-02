import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';

//Model List
const MODELS = [
    {
        path: '../3DModels/Cube.glb',
        name: 'Cube'
    },
    {
        path: '../3DModels/Duck.glb',
        name: 'Duck'
    },
    {
        path: '../3DModels/Fish.glb',
        name: 'Fish'
    },
    {
        path: '../3DModels/HW1_Asteroid.glb',
        name: 'HW1'
    },
    {
        path: '../3DModels/Pyramid.glb',
        name: 'Pyramid'
    },
    {
        path: '../3DModels/Roadster.glb',
        name: 'Roadster'
    },
    {
        path: '../3DModels/Sphere.glb',
        name: 'Sphere'
    },
];

function init() {
    // Creating the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Temporary Light
    const light = new THREE.PointLight(0xffffff, 4, 200);
    light.position.set(0,10,0);
    scene.add(light)

    // Loader
    const thingLoader = new GLTFLoader();
    
    thingLoader.load(MODELS[5].path, function (gltf) {
        var model = gltf.scene
        model.scale.set(3,3,3);
        scene.add(model);

        // Animate the scene
        function animate(item) {
            requestAnimationFrame( animate );
            model.rotation.x += 0.01;
            model.rotation.y += 0.01;
            // model.rotation.z += 0.01;
            renderer.render( scene, camera );
    
    }
    animate();
    } )

    camera.position.z = 5;


    
}

init();


