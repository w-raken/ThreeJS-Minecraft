import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import * as THREE from 'three/build/three.min';
const PointerLockControls = require('three-pointer-lock-controls')(THREE);
const ObjLoader = require('three-obj-loader')(THREE);
const MTLLoader = require('three-mtl-loader');

import * as STATS from 'stats-js';
import { ThrowStmt } from '../../../node_modules/@angular/compiler';

@Component({
    selector: 'game',
    templateUrl: require('./game.component.html'),
    styleUrls: [require('./game.component.scss')]
})
export class GameComponent implements OnInit {

    @ViewChild('rendererContainer') rendererContainer: ElementRef;
  
    private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
    private clock: THREE.CLock = new THREE.Clock();
    private velocity: THREE.Vector3 = new THREE.Vector3();
    private scene: THREE.Scene = null;
    private camera: THREE.PersepctiveCamera = null;
    private dirtTexture: THREE.TextureLoader = new THREE.TextureLoader().load( "../../../src/assets/images/dirt_cube.png" );
    private grassTexture: THREE.TextureLoader = new THREE.TextureLoader().load( "../../../src/assets/images/grass_cube.png" );
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private raycasterCollision: THREE.Raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    private object: THREE.OBJLoader = new THREE.OBJLoader();
    private mtl: THREE.MTLLoader = new MTLLoader();

    private intersects: any = null;
    private stats: STATS = null;
    private controls: any = null;
    private world: {x, y, z: number} = {
        x: 50,
        y: 5,
        z: 50
    }
    private delta: number;
    private onObject: boolean = false;
    private selectedItem: number = 1;
    private cubeNumber: number = 0;
    private cubeTotal: number = this.world.x * this.world.z;
    private worldFinishGenerating: boolean = false;
    private speed: number = 500;
    private cubeSize: number = 50;
    private state: {forward, backward, left, right, jump: boolean} = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false
    }
    private geometry = new THREE.BoxGeometry( this.cubeSize, this.cubeSize, this.cubeSize );
    private resetTarget = new THREE.Mesh( new THREE.BoxGeometry( this.cubeSize, this.cubeSize, this.cubeSize ), [
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
    ]);
    private currentTarget: THREE.Mesh = this.resetTarget;
    private currentFace: number = null;
    private currentModel;
    
    constructor() { }

    ngOnInit() {
        this.stats = new STATS();
        this.stats.setMode( 0 );

        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xbfd1e5 );
        this.scene.fog = new THREE.Fog( 0xbfd1e5, 1, 1500 );

        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );

        this.mtl.load( '../../../src/assets/images/pickaxe.mtl', function( materials ) {
            materials.preload();
            this.object.setMaterials( materials );
            this.object.load( '../../../src/assets/images/pickaxe.obj', function ( model ) {
                    model.position.y = -10;
                    model.position.x = 10;
                    model.position.z = -30;

                    model.rotation.y = 160;
                    model.rotation.x = 160;
                    model.rotation.z = 250;

                    model.scale.y = 0.7;
                    model.scale.x = 0.7;
                    model.scale.z = 0.7;

                    this.currentModel = model;
                    this.camera.add( model );
            }.bind(this),
            function ( xhr ) { },
            function ( error ) { });
        }.bind(this));

        this.controls = new PointerLockControls( this.camera );
        this.controls.getObject().position.y = this.cubeSize * 2;
        this.controls.getObject().position.x = ( this.world.x * this.cubeSize ) / 2;
        this.controls.getObject().position.z = ( this.world.z * this.cubeSize ) / 2;

        this.lockPointer();

        this.scene.add( this.controls.getObject() );

        document.body.appendChild( this.stats.domElement );

        setTimeout(() => {
            this.createWorld();
        }, 100);

        let light = new THREE.HemisphereLight( 0xbfd1e5, 0xffffff, 0.75 );
        light.position.set( 0.5, 1, 0.75 );
        this.scene.add( light );
    }
  
    /**
     * Iterate 60 times per seconds and update render
     * @return void
     */
    private animate(): void {

        this.stats.begin();

        window.requestAnimationFrame( () => this.animate() );

        if ( this.controls && this.worldFinishGenerating ) {

            this.delta = this.clock.getDelta();
    
            if ( this.state.forward ) {
                this.controls.getObject().translateZ( -this.delta * this.speed );
            }
            if ( this.state.backward ) {
                this.controls.getObject().translateZ( this.delta * this.speed );
            }
            if ( this.state.left ) {
                this.controls.getObject().translateX( -this.delta * this.speed );
            }
            if ( this.state.right ) {
                this.controls.getObject().translateX( this.delta * this.speed );
            }

            this.velocity.y -= 9.8 * 100 * this.delta;

            if ( this.onObject ) {
                this.velocity.y = Math.max( 0, this.velocity.y );
                this.state.jump = true;
            }

            this.controls.getObject().translateY(this.velocity.y * this.delta);

            if ( this.controls.getObject().position.y < this.cubeSize * 2 ) {
                this.velocity.y = 0;
                this.controls.getObject().position.y = this.cubeSize * 2;
                this.state.jump = true;
            }

            this.updateRaycaster();
              
            this.renderer.render( this.scene, this.camera ); 
        }

        this.stats.end();
    }

    /**
     * Generate an amazing world
     * @return void
     */
    private createWorld(): void {
        let loadingBar = document.getElementById('fill-bar');

        Array.from( Array( this.world.x ), ( _, indexX ) => {
            Array.from( Array( this.world.z ), ( _, indexZ ) => {
                setTimeout(() => {    
                    let cubeHeight = new THREE.Mesh( this.geometry, [
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
                    ]);
    
                    cubeHeight.position.x = indexZ * this.cubeSize;
                    cubeHeight.position.z = indexX * this.cubeSize;
                    cubeHeight.position.y = 0; //Math.floor( Math.random() * 2 ) * this.cubeSize;
    
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
     * Remove of block from scene
     * @return void
     */
    private removeBlock(): void {
        this.scene.remove( this.currentTarget );
    }

    /**
     * Create a block near the current target
     * @return void
     */
    private createBlock(): void {
        let newCube = new THREE.Mesh( this.geometry, [
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
        ]);

        switch ( this.currentFace ) {
            case 0:
            case 1:
                newCube.position.x = this.currentTarget.position.x + this.cubeSize;
                newCube.position.z = this.currentTarget.position.z;
                newCube.position.y = this.currentTarget.position.y;
                break;
            case 2:
            case 3:
                newCube.position.x = this.currentTarget.position.x - this.cubeSize;
                newCube.position.z = this.currentTarget.position.z;
                newCube.position.y = this.currentTarget.position.y;
                break;
            case 4:
            case 5:
                newCube.position.x = this.currentTarget.position.x;
                newCube.position.z = this.currentTarget.position.z;
                newCube.position.y = this.currentTarget.position.y + this.cubeSize;
                break;
            case 6:
            case 7:
                newCube.position.x = this.currentTarget.position.x;
                newCube.position.z = this.currentTarget.position.z;
                newCube.position.y = this.currentTarget.position.y - this.cubeSize;
                break;
            case 8:
            case 9:
                newCube.position.x = this.currentTarget.position.x;
                newCube.position.z = this.currentTarget.position.z + this.cubeSize;
                newCube.position.y = this.currentTarget.position.y;
                break;
            case 10:
            case 11:
                newCube.position.x = this.currentTarget.position.x;
                newCube.position.z = this.currentTarget.position.z - this.cubeSize;
                newCube.position.y = this.currentTarget.position.y;
                break;
            default:
                break;
        }

        this.currentTarget = newCube;
        this.scene.add( newCube );
    }

    /**
     * Update the raycaster
     * @return void
     */
    private updateRaycaster(): void {
        this.raycaster.setFromCamera( new THREE.Vector3(), this.camera );
        this.raycaster.far = 200;
        this.raycaster.near = 0.00001;

        this.intersects = this.raycaster.intersectObjects( this.scene.children );

        this.raycasterCollision.ray.origin.copy( this.controls.getObject().position );
        this.raycasterCollision.ray.origin.y -= this.cubeSize;

        var objectCollision = this.raycasterCollision.intersectObjects( this.scene.children );

        this.onObject = objectCollision.length > 0;

        if ( this.intersects.length > 0 ) {
            if (this.currentTarget.uuid != this.intersects[ 0 ].object.uuid) {
                this.currentTarget.material.forEach( element => {
                    element.transparent = false;
                });
                this.intersects[ 0 ].object.material.forEach( element => {
                    element.transparent = true;
                    element.opacity = 0.8;
                });
                this.currentTarget = this.intersects[ 0 ].object;
                this.currentFace = this.intersects[0].faceIndex;
            }
        }

        if ( this.intersects.length <= 0 ) {
            this.currentTarget.material.forEach( element => {
                element.transparent = false;
            });
            this.currentTarget = this.resetTarget;
        }
    }

    /**
     * Control the pointer's state
     * @return void
     */
    private lockPointer(): void {
        document.getElementById('menu').style.display = 'none';

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

        element.requestPointerLock();
    }

    /**
     * Update the state of pointer lock
     * @param event KeyboardEvent
     * @return void
     */
    @HostListener( 'window:mousedown', ['$event'] )
    private onClickDown( event: any ): void {
        this.currentModel.position.z -= 10;
        this.currentModel.position.y -= 5;
        this.currentModel.rotation.x += 6;

        if ( !this.controls.enabled ) {
            this.lockPointer();
        } else {
            switch ( this.selectedItem ) {
                case 1:
                    this.removeBlock();
                    break;
                case 2:
                    this.createBlock();
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Function triggered on mouseup
     * @param event KeyboardEvent
     * @return void
     */
    @HostListener( 'window:mouseup', ['$event'] )
    private onClickUp( event: any ): void {
        this.currentModel.position.z = -30;
        this.currentModel.position.y = -10;
        this.currentModel.rotation.y = 160;
        this.currentModel.rotation.x = 160;
        this.currentModel.rotation.z = 250;
    }

    /**
     * Function triggered on mouseup
     * @param event KeyboardEvent
     * @return void
     */
    @HostListener( 'window:keydown', ['$event'] )
    private onKeyDown( event: KeyboardEvent ): void {
        if ( this.controls.enabled ) {
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
                    if (this.state.jump) {
                        this.velocity.y += 350;
                    }
                    this.state.jump = false;
                    break;
                case 27:
                    document.getElementById('menu').style.display = 'block';
                    this.controls.enabled = false;
                    document.exitPointerLock();
                    break;
                case 49:
                    this.selectedItem = 1;
                    break;
                case 50:
                    this.selectedItem = 2;
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Update the state of each key pressed
     * @param event KeyboardEvent
     * @return void
     */
    @HostListener( 'window:keyup', ['$event'] )
    private onKeyUp( event: KeyboardEvent ): void {
        if ( this.controls.enabled ) {
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