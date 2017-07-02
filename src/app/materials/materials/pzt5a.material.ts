import { Material } from '../material';
import { MaterialClass } from '../material-class.enum';

export const PZT5A = new Material(-4,
  'Lead Zirconate Titanate - 5A',
  MaterialClass.Ceramic_TP,
  7750,
  [
    [12.1, 7.59, 7.54, 0, 0, 0],
    [7.59, 12.1, 7.54, 0, 0, 0],
    [7.54, 7.54, 11.1, 0, 0, 0],
    [0, 0, 0, 2.11, 0, 0],
    [0, 0, 0, 0, 2.11, 0],
    [0, 0, 0, 0, 0, 2.26]
  ], [[0, 0, 0, 0, 12.3, 0],
    [0, 0, 0, 12.3, 0, 0],
    [-5.4, -5.4, 15.8, 0, 0, 0]
  ], [
    [0.811, 0, 0],
    [0, 0.811, 0],
    [0, 0, 0.735]
  ]
)
