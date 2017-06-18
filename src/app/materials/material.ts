import { MaterialClass } from './material-class.enum';

export class Material {
  type: MaterialClass;
  id: string;
  name: string;
  density: number;
  c: number[][];
  e: number[][];
  epsilon: number[][];

  constructor (id: string) {
    this.id = id;
    this.name = 'New Material';
    this.type = MaterialClass.Crystal;
    this.c = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];
    this.e = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ];
    this.epsilon = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  }
}
