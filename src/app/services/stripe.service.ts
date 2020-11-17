import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const REWORK_BACKEND_URL = environment.rework_backend_url;


@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor( private http: HttpClient ) { }

  // Obtener sesión de checkout
  getCheckoutSession(): void {

    this.http.post(`${ REWORK_BACKEND_URL }/stripe/checkout-session`, {})
      .subscribe( res => {
        console.log( res );
      });

  }

}
