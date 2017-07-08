import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pevc-number-output',
  templateUrl: './number-output.component.html',
  styleUrls: ['./number-output.component.css']
})
export class NumberOutputComponent implements OnInit {

  @Input() numericData: object;

  constructor() { }

  ngOnInit() {
  }

}
