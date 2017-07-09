import { Material } from '../material';
import { MaterialClass } from '../material-class.enum';

export const PZT4 = new Material(-3,
  'Lead Zirconate Titanate - 4',
  MaterialClass.Ceramic_TP,
  7500,
  0.005,
  0.35,
  1200,
  [[13.9, 7.78, 7.4, 0, 0, 0],
    [7.78, 13.9, 7.4, 0, 0, 0],
    [7.4, 7.4, 11.5, 0, 0, 0],
    [0, 0, 0, 2.56, 0, 0],
    [0, 0, 0, 0, 2.56, 0],
    [0, 0, 0, 0, 0, 3.06]
  ], [
    [0, 0, 0, 0, 12.7, 0],
    [0, 0, 0, 12.7, 0, 0],
    [-5.2, -5.2, 15.1, 0, 0, 0]
  ], [[0.646, 0, 0],
    [0, 0.646, 0],
    [0, 0, 0.562]
  ],
  [75, 62]
)
