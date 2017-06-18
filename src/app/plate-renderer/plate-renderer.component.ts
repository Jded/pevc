import { Component, OnInit } from '@angular/core';

import { PerspectiveCamera, BoxGeometry } from '@types/three'
import { PlateModel } from './plate-model';

@Component({
  selector: 'pevc-plate-renderer',
  templateUrl: './plate-renderer.component.html',
  styleUrls: ['./plate-renderer.component.css']
})
export class PlateRendererComponent implements OnInit {

  plateModel;
  clicking;
  camera: PerspectiveCamera;
  scene; renderer; projector; mouse3D;
  geometry; geometry2; material; cube; material2; cube2;

  constructor() { }


  ngOnInit() {
  }


  swapGeometry(){
    cube.geometry = plateModel.box;
    cube2.geometry = plateModel.modifiedGeometry;
    cube.geometry.needsUpdate = true;
    cube2.geometry.needsUpdate = true;
    render();
  }
  init(parent) {
    scene = new THREE.Scene();
    this.camera = new PerspectiveCamera( 60, Math.max(parent.width(),800)/ 800, 1, 1000 );
    camera.position.z = 100;
    var light = new THREE.DirectionalLight( 0xccccff, 7 );
    light.position.set( 30, 150, 150 );
    scene.add( light );
    var light2 = new THREE.DirectionalLight( 0xffcccc, 7, 250 );
    light2.position.set( -30, -150, 150 );
    scene.add( light2 );
    projector = new THREE.Projector();
    renderer = new THREE.WebGLRenderer();
    displayResize();
    renderer.setClearColor( 0xffffff, 1 );

    parent[0].appendChild( renderer.domElement );
    //plateModel = new PlateModel(Date.now()); // pzPlateModel.getModel('default',true);
    material = new THREE.MeshPhongMaterial( { color: 0x00cc00, transparent:true,opacity:0.3});
    material2 = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true} );
    cube = new THREE.Mesh( geometry, material );
    cube2 = new THREE.Mesh( geometry2, material2 );
    cube2.geometry.dynamic = true;
    swapGeometry();
    scene.add( cube );
    scene.add( cube2 );
    addGrid();
    camera.position.z = 25;
    var controls = new THREE.OrbitControls(camera, parent[0], renderer.domElement);
    controls.damping = 0.2;
    controls.addEventListener( 'change', render );
  }

  addGrid(){
    var size = 500, step = 10;

    var lineGeo = new THREE.Geometry();
    var lineGeo2 = new THREE.Geometry();
    var lineGeo3 = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial( { color: 0xcccccc, opacity: 0.2 } );
    for ( var i = - size; i <= size; i += step ) {

      lineGeo.vertices.push( new THREE.Vector3( - size, 0, i ) );
      lineGeo.vertices.push( new THREE.Vector3(   size, 0, i ) );
      lineGeo.vertices.push( new THREE.Vector3( i, 0, - size ) );
      lineGeo.vertices.push( new THREE.Vector3( i, 0,   size ) );

    }

    var line = new THREE.Line( lineGeo, material, THREE.LinePieces );
    scene.add( line );
  }
  render() {
    renderer.render( scene, camera );
  }

}
