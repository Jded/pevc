import { Material } from '../material';
import { MaterialClass } from '../material-class.enum';

export const PZT5H = new Material(-5,
  'Lead Zirconate Titanate - 5H',
  MaterialClass.Ceramic_TP,
  7500,
  0.013,
  0.34,
  65,
  [
    [12.6, 7.95, 8.41, 0, 0, 0],
    [7.95, 12.6, 8.41, 0, 0, 0],
    [8.41, 8.41, 11.7, 0, 0, 0],
    [0, 0, 0, 2.3, 0, 0],
    [0, 0, 0, 0, 2.3, 0],
    [0, 0, 0, 0, 0, 2.35]
  ], [[0, 0, 0, 0, 17, 0],
    [0, 0, 0, 17, 0, 0],
    [-6.5, -6.5, 23.3, 0, 0, 0]
  ], [
    [1.505, 0, 0],
    [0, 1.505, 0],
    [0, 0, 1.302]
  ],
  [74, 50]
)
