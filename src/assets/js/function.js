import THREE from './three';
import * as Stats from 'stats-js';

let fps = new Stats();

let camera, controls, scene, renderer;
let geometry, material, mesh;

fps.setMode(0);
document.body.appendChild(fps.domElement);

export let init = () => {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    controls = new THREE.OrbitControls(camera);

    camera.position.z = 1;
    controls.update();

 
    scene = new THREE.Scene();
 
    for (let index = 0; index < 8; index++) {
        geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        material = new THREE.MeshNormalMaterial();

        mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );

        mesh.position.set(index/10, index/10, index/10);

        console.log("Cube n" + index + " :  created, position : " + JSON.stringify(mesh.getWorldPosition()));
    }

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    renderer.render( scene, camera );

}
 
export let animate = () => {

    fps.begin();

    requestAnimationFrame( animate );
 
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    controls.update();
 
    renderer.render( scene, camera );
 
    fps.end();

}