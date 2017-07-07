import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pevc-tensor-output',
  templateUrl: './tensor-output.component.html',
  styleUrls: ['./tensor-output.component.css']
})
export class TensorOutputComponent implements OnInit {

  @Input() tensorData: number[][]

  constructor() { }

  ngOnInit() {
  }

}
