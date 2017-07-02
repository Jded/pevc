import { Material } from '../material';
import { MaterialClass } from '../material-class.enum';

export const BaTiO3 = new Material(-7,
  'Barium Titanate',
  MaterialClass.Ceramic_TP,
  5700,
  [[15, 6.53, 6.62, 0, 0, 0],
    [6.53, 15.6, 6.62, 0, 0, 0],
    [6.62, 6.62, 14.6, 0, 0, 0],
    [0, 0, 0, 4.39, 0, 0],
    [0, 0, 0, 0, 4.39, 0],
    [0, 0, 0, 0, 0, 4.24]
  ], [
    [0, 0, 0, 0, 11.4, 0],
    [0, 0, 0, 11.4, 0, 0],
    [-4.3, -4.3, 17.5, 0, 0, 0]
  ], [[0.987, 0, 0],
    [0, 0.987, 0],
    [0, 0, 1.116]
  ]
)
