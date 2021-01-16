import { formatCurrency } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {

  transform(price: number): string {

     let formattedPrice: number | string = price / 100;
     formattedPrice = formatCurrency( formattedPrice , 'en', '$', 'USD', '0.0-0');
    
      return `${formattedPrice} USD`;

  }

}
