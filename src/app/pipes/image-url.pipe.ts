import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {

  digitalOceanSpace = environment.digital_ocean_spaces;

  transform(image: string): string {

    return `${ this.digitalOceanSpace }/${ image }`;

  }

}
