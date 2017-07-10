import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pevc-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css']
})
export class MaterialListComponent implements OnInit {

  materialOptions$: Observable<object[]>;
  editedMaterial$: Observable<number>;

  constructor(private materialOptionStore: Store<object[]>,
              private materialEditedStore: Store<number>) {
    this.materialOptions$ = materialOptionStore.select('materialOptions');
    this.editedMaterial$ = materialEditedStore.select('materialEdited');
  }

  ngOnInit() {
  }

}
