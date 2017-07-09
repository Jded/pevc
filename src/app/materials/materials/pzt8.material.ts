import { Material } from '../material';
import { MaterialClass } from '../material-class.enum';

export const PZT8 = new Material(-6,
  'Lead Zirconate Titanate - 8',
  MaterialClass.Ceramic_TP,
  7600,
  0.002,
  0.33,
  800,
  [[13.7, 6.99, 7.11, 0, 0, 0],
    [6.99, 13.7, 7.11, 0, 0, 0],
    [7.11, 7.11, 12.3, 0, 0, 0],
    [0, 0, 0, 3.13, 0, 0],
    [0, 0, 0, 0, 3.13, 0],
    [0, 0, 0, 0, 0, 3.36]
  ], [
    [0, 0, 0, 0, 10.4, 0],
    [0, 0, 0, 10.4, 0, 0],
    [-4.0, -4.0, 13.2, 0, 0, 0]
  ], [[0.797, 0, 0],
    [0, 0.797, 0],
    [0, 0, 0.514]
  ],
  [86, 71]
)
