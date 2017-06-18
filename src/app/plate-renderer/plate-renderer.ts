import {
  Scene, WebGLRenderer, Projector, PerspectiveCamera, DirectionalLight,
  MeshPhongMaterial, MeshBasicMaterial, OrbitControls, Mesh, Geometry, LineBasicMaterial, Line, Vector3, LinePieces
} from 'three'
import { Dir } from '@angular/material';
import { PlateModel } from './plate-model';

export class PlateRenderer {
  plate: PlateModel;
  scene: Scene;
  renderer: WebGLRenderer;
  projector: Projector;
  camera: PerspectiveCamera;
  lightOne: DirectionalLight;
  lightTwo: DirectionalLight;
  controls: OrbitControls;
  cube: Mesh;
  cube2: Mesh;
  line: Line;

  constructor(initSize: number, plateModel: PlateModel) {
    this.plate = plateModel;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(60, Math.max(initSize, 800) / 800, 1, 1000);
    this.camera.position.z = 25;
    this.lightOne = new DirectionalLight(0xccccff, 7);
    this.lightOne.position.set(30, 150, 150);
    this.scene.add(this.lightOne);
    this.lightTwo = new DirectionalLight(0xffcccc, 7);
    this.lightTwo.position.set(-30, -150, 150);
    this.scene.add(this.lightTwo);
    this.projector = new Projector();
    this.renderer = new WebGLRenderer();
    this.displayResize(initSize);
    this.renderer.setClearColor( 0xffffff, 1 );

    const material = new MeshPhongMaterial( { color: 0x00cc00, transparent:true,opacity:0.3});
    const material2 = new MeshBasicMaterial( { color: 0x000000, wireframe: true} );
    this.cube = new Mesh( plateModel.box, material );
    this.cube2 = new Mesh( plateModel.modifiedGeometry, material2 );
    this.cube2.geometry.dynamic = true;
    this.cube.geometry.needsUpdate = true;
    this.cube2.geometry.needsUpdate = true;
    this.scene.add( this.cube );
    this.scene.add( this.cube2 );
    this.addGrid();
    this.addControls();
  }

  addControls(){
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.damping = 0.2;
    this.controls.addEventListener( 'change', this.render );
  }

  addGrid() {
    const size = 500, step = 10;

    const lineGeo = new Geometry();
    const lineGeo2 = new Geometry();
    const lineGeo3 = new Geometry();
    const material = new LineBasicMaterial( { color: 0xcccccc, opacity: 0.2 } );
    for ( let i = - size; i <= size; i += step ) {

      lineGeo.vertices.push( new Vector3( - size, 0, i ) );
      lineGeo.vertices.push( new Vector3(   size, 0, i ) );
      lineGeo.vertices.push( new Vector3( i, 0, - size ) );
      lineGeo.vertices.push( new Vector3( i, 0,   size ) );

    }

    const line = new Line( lineGeo, material, LinePieces );
    this.scene.add( line );
  }

  displayResize(size: number) {
    const pw: number = Math.max(size, 100);
    this.renderer.setSize(pw - 10, 3 * (pw - 20) / 5);
  }

  render() {
    this.renderer.render( this.scene, this.camera );
  }

  swapGeometry() {
    this.cube.geometry = this.plate.box;
    this.cube2.geometry = this.plate.modifiedGeometry;
    this.cube.geometry.needsUpdate = true;
    this.cube2.geometry.needsUpdate = true;
  }

}
