import { Pipe, PipeTransform } from '@angular/core';


const translationTable: Map<string, (argument: string) => string> = new Map();

  translationTable['required'] = (argument) => 'This value is required';
  translationTable['min'] = (argument) => 'Needs a value higher than 0';
  translationTable['max'] = (argument) => 'Needs a value lower than ' + argument;



@Pipe({
  name: 'errorTranslator'
})
export class ErrorTranslatorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(args)
    if (translationTable[value]) {return translationTable[value](args); }
    return value;
  }

}
