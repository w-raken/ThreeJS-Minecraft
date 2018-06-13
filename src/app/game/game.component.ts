import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import * as THREE from 'three/build/three.min';
const PointerLockControls = require('three-pointer-lock-controls')(THREE);
import * as STATS from 'stats-js';

@Component({
    selector: 'game',
    templateUrl: require('./game.component.html'),
    styleUrls: [require('./game.component.scss')]
})
export class GameComponent implements OnInit {

    @ViewChild('rendererContainer') rendererContainer: ElementRef;
  
    // Exotics variables
    private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
    private clock: THREE.CLock = new THREE.Clock();
    private velocity: THREE.Vector3 = new THREE.Vector3();
    private scene: THREE.Scene = null;
    private camera: THREE.PersepctiveCamera = null;
    private dirtTexture: THREE.TextureLoader = new THREE.TextureLoader().load( "../../../src/assets/images/dirt_cube.png" );
    private grassTexture: THREE.TextureLoader = new THREE.TextureLoader().load( "../../../src/assets/images/grass_cube.png" );
    private materialsCube: THREE.MeshLambertMaterial[] = [];
    private stats: STATS = null;
    private controls: any = null;

    // Classics variables
    private world = {
        width: 80,
        height: 80
    }
    private cubeNumber: number = 0;
    private cubeTotal: number = this.world.width * this.world.height;
    private worldFinishGenerating: boolean = false;
    private speed: number = 500;
    private cubeSize: number = 50;
    private state = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false
    }
    
    constructor() { }

    ngOnInit() {
        this.stats = new STATS();
        this.stats.setMode( 0 );

        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xbfd1e5 );

        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );

        this.controls = new PointerLockControls( this.camera );
        this.controls.getObject().position.y = this.cubeSize * 2;
        this.controls.getObject().position.x = ( this.world.width * this.cubeSize ) / 2;
        this.controls.getObject().position.z = ( this.world.height * this.cubeSize ) / 2;
        this.scene.add( this.controls.getObject() );

        document.body.appendChild( this.stats.domElement );

        this.materialsCube = [
            new THREE.MeshLambertMaterial({
                map: this.dirtTexture
            }),
            new THREE.MeshLambertMaterial({
                map: this.dirtTexture
            }),
            new THREE.MeshLambertMaterial({
                map: this.grassTexture
            }),
            new THREE.MeshLambertMaterial({
                map: this.dirtTexture
            }),
            new THREE.MeshLambertMaterial({
                map: this.dirtTexture
            }),
            new THREE.MeshLambertMaterial({
                map: this.dirtTexture
            })
        ];

        setTimeout(() => {
            this.createWorld();
        }, 100);

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
        directionalLight.position.set( 1, 1, 0.5 ).normalize();
        this.scene.add( directionalLight );
    }
  
    /**
     * Iterate 60 times per seconds and update render
     * @return void
     */
    private animate(): void {

        this.stats.begin();

        window.requestAnimationFrame( () => this.animate() );

        if ( this.controls && this.worldFinishGenerating ) {
            let delta = this.clock.getDelta();
    
            if ( this.state.forward ) {
                this.controls.getObject().translateZ( -delta * this.speed );
            }
            if ( this.state.backward ) {
                this.controls.getObject().translateZ( delta * this.speed );
            }
            if ( this.state.left ) {
                this.controls.getObject().translateX( -delta * this.speed );
            }
            if ( this.state.right ) {
                this.controls.getObject().translateX( delta * this.speed );
            }
            if ( this.state.jump ) {
                this.velocity.y -= 9.8 * 100 * delta;
                this.controls.getObject().translateY(this.velocity.y * delta);
            }
    
            if ( this.controls.getObject().position.y < this.cubeSize * 2 ) {
                this.velocity.y = 0;
                this.controls.getObject().position.y = this.cubeSize * 2;
                this.state.jump = true;
            }
              
            this.renderer.render( this.scene, this.camera ); 
        }

        this.stats.end();
    }

    /**
     * Generate an amazing world
     * @return void
     */
    private createWorld(): void {
        const geometry = new THREE.BoxGeometry( this.cubeSize, this.cubeSize, this.cubeSize );

        let loadingBar = document.getElementById('fill-bar');

        Array.from( Array( this.world.width ), ( _, indexWidth ) => {
            Array.from( Array( this.world.height ), ( _, indexHeight ) => {
                setTimeout(() => {    
                    let cubeHeight = new THREE.Mesh( geometry, this.materialsCube );
    
                    cubeHeight.position.x = indexHeight * this.cubeSize;
                    cubeHeight.position.z = indexWidth * this.cubeSize;
                    cubeHeight.position.y = Math.floor( Math.random() * 2 ) * this.cubeSize;
    
                    this.cubeNumber++;
                    loadingBar.style.width = ( this.cubeNumber * 100 ) / this.cubeTotal + '%';
                    this.scene.add( cubeHeight );
                }, 0);
            });
        });

        this.worldFinishGenerating = true;

        setTimeout(() => {
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
            }, 200);
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.rendererContainer.nativeElement.appendChild( this.renderer.domElement );
        
            this.animate();
        }, 1000);
    }

    /**
     * Update the state of pointer lock
     * @param event KeyboardEvent
     * @return void
     */
    @HostListener( 'window:click', ['$event'] )
    private onClick( event: any ): void {
        let element = document.body;

        let pointerlockchange = function ( event ) {
            if ( document.pointerLockElement == element ) {
                this.controls.enabled = true;
            } else {
                this.controls.enabled = false;
            }
        }.bind(this);
        let pointerlockerror = function ( event ) {}.bind(this);

        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'pointerlockerror', pointerlockerror, false );

        element.requestPointerLock = element.requestPointerLock;
        element.requestPointerLock();
    }

    /**
     * Update the state of each key pressed
     * @param event KeyboardEvent
     * @return void
     */
    @HostListener( 'window:keydown', ['$event'] )
    private onKeyDown( event: KeyboardEvent ): void {
        switch ( event.keyCode ) {
            case 38:
            case 90:
                this.state.forward = true;
                break;
            case 40:
            case 83:
                this.state.backward = true;
                break;
            case 37:
            case 81:
                this.state.left = true;
                break;
            case 39:
            case 68:
                this.state.right = true;
                break;
            case 32:
                this.state.jump = true;
                this.velocity.y += 350;
                break;
            default:
                break;
        }
    }

    /**
     * Update the state of each key pressed
     * @param event KeyboardEvent
     * @return void
     */
    @HostListener( 'window:keyup', ['$event'] )
    private onKeyUp( event: KeyboardEvent ): void {
        switch ( event.keyCode ) {
            case 38:
            case 90:
                this.state.forward = false;
                break;
            case 40:
            case 83:
                this.state.backward = false;
                break;
            case 37:
            case 81:
                this.state.left = false;
                break;
            case 39:
            case 68:
                this.state.right = false;
                break;
            default:
                break;
        }
    }

    /**
     * Update the renderer size when resizing window
     * @param event Event
     * @return void
     */
    @HostListener( 'window:resize', ['$event'] )
    onWindowResize( event: Event) : void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}