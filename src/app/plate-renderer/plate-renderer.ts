import {
  Scene, WebGLRenderer, Projector, DirectionalLight,
  MeshPhongMaterial, MeshBasicMaterial, Mesh, Geometry, LineBasicMaterial, Line, Vector3, LinePieces, PerspectiveCamera
} from 'three'

import { OrbitControls} from 'three-orbitcontrols-ts'

import { Dir } from '@angular/material';
import { PlateDistortionModel } from '../physics-core/plate-distortion-model';

import * as THREE from 'three'; // hack for supplying OrbitControls with proper class camera

let rendererReference, sceneReference, cameraReference;

export class PlateRenderer {
  plate: PlateDistortionModel;
  scene: Scene;
  glRenderer: WebGLRenderer;
  projector: Projector;
  camera: PerspectiveCamera;
  lightOne: DirectionalLight;
  lightTwo: DirectionalLight;
  controls: any;
  cube: Mesh;
  cube2: Mesh;
  line: Line;

  constructor(initSize: number, plateModel: PlateDistortionModel) {
    this.plate = plateModel;
    this.scene = new Scene();
    cameraReference = this.camera = new PerspectiveCamera(60, Math.max(initSize, 800) / 800, 1, 1000);
    this.camera.position.z = 25;
    this.lightOne = new DirectionalLight(0xccccff, 7);
    this.lightOne.position.set(30, 150, 150);
    this.scene.add(this.lightOne);
    this.lightTwo = new DirectionalLight(0xffcccc, 7);
    this.lightTwo.position.set(-30, -150, 150);
    sceneReference = this.scene.add(this.lightTwo);
    this.projector = new Projector();
    rendererReference = this.glRenderer = new WebGLRenderer();
    this.displayResize(initSize);
    this.glRenderer.setClearColor( 0xffffff, 1 );
  }

  setupScene() {
    const material = new MeshPhongMaterial( { color: 0x00cc00, transparent: true, opacity: 0.3});
    const material2 = new MeshBasicMaterial( { color: 0x000000, wireframe: true} );
    this.cube = new Mesh( this.plate.box, material );
    this.cube2 = new Mesh( this.plate.modifiedGeometry, material2 );
    const geometry1 = <Geometry> this.cube.geometry;
    geometry1.verticesNeedUpdate = true;
    const geometry2 = <Geometry> this.cube2.geometry
    geometry2.verticesNeedUpdate = true;
    this.scene.add( this.cube );
    this.scene.add( this.cube2 );
    this.addGrid();
    this.addControls();
  }

  getDomElement() {
    return this.glRenderer.domElement;
  }

  addControls() {
    this.controls = new OrbitControls(this.camera, this.glRenderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;
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
    this.glRenderer.setSize(pw - 10, 3 * (pw - 20) / 5);
  }

  render() {
    rendererReference.render( sceneReference, cameraReference );
  }

  swapGeometry() {
    this.cube.geometry = this.plate.box;
    this.cube2.geometry = this.plate.modifiedGeometry;
    this.cube.geometry.verticesNeedUpdate = true;
    this.cube2.geometry.verticesNeedUpdate = true;
  }

}
