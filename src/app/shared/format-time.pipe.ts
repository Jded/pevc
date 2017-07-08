import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(scaledTime: number, args?: any): any {
    const minutes = Math.floor(scaledTime / 60000);
    const seconds = Math.floor(scaledTime / 1000) % 60;
    const mili = scaledTime % 1000;
    let res = '';
    if (minutes > 0) {
      if (minutes < 10) {
        res += '0' + minutes + ':';
      } else {
        res += minutes + ':';
      }
    }
    if (seconds < 10) {
      res += '0' + seconds + ':';
    } else {
      res += seconds + ':';
    }
    const zeroes = 3 - Math.round(mili).toString().length;
    for (let i = 0; i < zeroes; i++) {
      res += '0';
    }
    res += mili;
    return res;
  }
}
