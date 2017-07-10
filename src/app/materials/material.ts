import { MaterialClass } from './material-class.enum';


const defaultC = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

const defaultE = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0]
];

const defaultEpsilon = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

const defaultYoung = [0, 0];

export class Material {
  type: MaterialClass;
  id: number;
  name: string;
  density: number;
  dissipationFactor: number;
  poisonRatio: number;
  mechQ: number;
  c: number[][];
  e: number[][];
  epsilon: number[][];
  youngModulus: number[];

  static deserialize(serialized: object) {
    if ( !serialized.hasOwnProperty('id')) {
      throw new Error('Supplied JSON object is not a serialized material');
    }
    const material = new Material(serialized['id']);
    Object.assign(material, serialized);
    return material;
  }

  constructor (id: number,
               name: string = 'New Material',
               type: MaterialClass = MaterialClass.Crystal,
               density: number = 1,
               dissipationFactor: number = 1,
               poisonRatio: number = 0,
               mechQ: number = 0,
               c: number[][] = defaultC, // s
               e: number[][] = defaultE, // d
               epsilon: number[][] = defaultEpsilon, // epsilon
               young: number[] = defaultYoung
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.density = density;
    this.dissipationFactor = dissipationFactor;
    this.poisonRatio = poisonRatio;
    this.mechQ = mechQ;
    this.c = c;
    this.e = e;
    this.epsilon = epsilon;
    this.youngModulus = young;
  }

  serialize() {
    return Object.assign({}, this);
  }
}
