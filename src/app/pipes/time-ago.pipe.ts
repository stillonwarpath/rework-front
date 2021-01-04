import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(date: string): string {

    moment.locale('es');
    const currentDate = moment();
    const createdDate = moment(date);

    return createdDate.from(currentDate, true);

  }

}
