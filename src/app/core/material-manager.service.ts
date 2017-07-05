import { Injectable } from '@angular/core';
import { Material } from '../materials/material';
import { Quartz } from '../materials/materials/quartz.material';
import { Langasite } from '../materials/materials/langasite.material';
import { BaTiO3 } from '../materials/materials/batio3.material';
import { PZT4 } from '../materials/materials/pzt4.material';
import { PZT5A } from '../materials/materials/pzt5a.material';
import { PZT5H } from '../materials/materials/pzt5h.material';
import { PZT8 } from '../materials/materials/pzt8.material';
import { Action, Store } from '@ngrx/store';
import { AddMaterialsAction, UpdateMaterialAction } from '../actions/material.action';
import { MaterialClass } from '../materials/material-class.enum';

@Injectable()



export class MaterialManagerService {

  materials: Material[];
  lastCustomIndex = 0;

  defaultMaterials = new Map <MaterialClass, Material> ();

  constructor(private store: Store<object[]>) {
    this.initDefaultMaterials();
    this.initStoredMaterials();
    this.defaultMaterials[MaterialClass.Crystal] = Quartz;
    this.defaultMaterials[MaterialClass.Ceramic_TP] = BaTiO3;
    this.store.dispatch(new AddMaterialsAction(this.materials))
  }

  initDefaultMaterials() {
    this.materials = new Array<Material>();
    this.materials.push(Quartz);
    this.materials.push(Langasite);
    this.materials.push(BaTiO3);
    this.materials.push(PZT4);
    this.materials.push(PZT5A);
    this.materials.push(PZT5H);
    this.materials.push(PZT8);
  }

  initStoredMaterials() {
    const stored: string = localStorage.getItem('storedMaterials');
    if (stored !== null && stored !== '') {
      const materials: object[] = JSON.parse(stored);
      for (const serializedMaterial of materials){
          const material: Material = Material.deserialize(serializedMaterial);
          this.lastCustomIndex = Math.max(material.id, this.lastCustomIndex);
      }
    }
  }

  addMaterial() {
    const newCustom = new Material(++this.lastCustomIndex);
    this.serialize();
    this.store.dispatch(new AddMaterialsAction([newCustom]));
  }

  updateMaterial(material: Material) {
    for (const candidateMaterial of this.materials){
      if (candidateMaterial.id === material.id) {
        Object.assign(candidateMaterial, material);
      }
    }
    this.serialize();
    this.store.dispatch(new UpdateMaterialAction(material));
  }

  getMaterial(id: number) {
    for (const material of this.materials){
      if (id === material.id) {
        return material;
      }
    }
    return null;
  }



  serialize() {
    localStorage.setItem('storedMaterials', JSON.stringify(this.materials.map((material) => material.serialize())));
  }
}
