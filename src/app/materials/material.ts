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

export class Material {
  type: MaterialClass;
  id: number;
  name: string;
  density: number;
  c: number[][];
  e: number[][];
  epsilon: number[][];

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
               c: number[][] = defaultC,
               e: number[][] = defaultE,
               epsilon: number[][] = defaultEpsilon
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.density = density;
    this.c = c;
    this.e = e;
    this.epsilon = epsilon;
  }

  serialize() {
    return Object.assign({}, this);
  }
}
