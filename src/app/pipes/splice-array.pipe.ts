import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spliceArray'
})
export class SpliceArrayPipe implements PipeTransform {

  transform(array: any[], startPosition:number, endPosition: number): any[] {
    
    return array.slice( startPosition, endPosition);

  }

}
