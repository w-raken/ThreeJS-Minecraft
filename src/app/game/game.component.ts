import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'game',
    templateUrl: require('./game.component.html'),
    styleUrls: [require('./game.component.scss')]
})
export class GameComponent implements OnInit {

    @ViewChild('rendererContainer') rendererContainer: ElementRef;
  
    private renderer = new THREE.WebGLRenderer();
    private scene: THREE.Scene = null;
    private camera: THREE.PersepctiveCamera = null;
    private cube: THREE.Mesh = null;
    
    constructor() { }

    ngOnInit() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 1000;

        const geometry = new THREE.BoxGeometry(200, 200, 200);

        this.cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true}));

        this.scene.add(this.cube);
    }
  
    ngAfterViewInit() {
        this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  
        this.animate();
    }
  
    private animate(): void {
        window.requestAnimationFrame(() => this.animate());
        //this.cube.rotation.x += 0.01;
        //this.cube.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
    }


    private onMouseMove(event: MouseEvent): void {
        const movementX = event.movementX;
        const movementY = event.movementY;

        this.cube.rotation.y -= movementX * 0.002;
        this.cube.rotation.x -= movementY * 0.002;

        this.cube.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cube.rotation.x));
    }

    private onMouseUp(event): void {

    }

    private onMouseDown(event): void {

    }
}