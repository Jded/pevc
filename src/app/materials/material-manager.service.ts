import { Injectable } from '@angular/core';
import { Material } from './material';

@Injectable()
export class MaterialManagerService {

  materials: Material[];

  constructor() { }

}
