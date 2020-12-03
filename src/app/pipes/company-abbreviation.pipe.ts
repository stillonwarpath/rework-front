import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'companyAbbreviation'
})
export class CompanyAbbreviationPipe implements PipeTransform {

  transform(name: string): string {

    let counter = 0;
    let abbreviation = '';
    const words = name.toUpperCase().split(' ');

    words.forEach( word => {

      if ( counter  < 2 ) {
        abbreviation += word[0];
      }

      counter++;


    });

    return abbreviation;

  }

}
