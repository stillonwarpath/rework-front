import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'locationsSplit'
})
export class LocationsSplitPipe implements PipeTransform {

  transform(location: string): string[] {

    let locations = location.split(';');

    locations = locations.map( location => {
      
      return location.trim();

    });

    return locations;

  }

}
