import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MaterialManagerService } from '../../core/material-manager.service';
import { Observable } from 'rxjs/Observable';
import { Material } from '../../materials/material';

@Component({
  selector: 'pevc-material-view',
  templateUrl: './material-view.component.html',
  styleUrls: ['./material-view.component.css']
})
export class MaterialViewComponent implements OnInit {

  materialDetails$: Observable<Material>

  constructor(private route: ActivatedRoute, private materialService: MaterialManagerService) {
    this.materialDetails$ = this.route.paramMap
      .map((params: ParamMap) =>
        this.materialService.getMaterial(parseFloat(params.get('id'))))
  }

  ngOnInit() {
  }

}
