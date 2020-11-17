import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ICheckoutSessionCreated } from '../interfaces/checkout-session-created.interface';

const REWORK_BACKEND_URL = environment.rework_backend_url;


@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor( private http: HttpClient ) { }

  // Obtener sesión de checkout
  getCheckoutSession( jobId: string ): Promise<string> {

    const data = { jobId };

    return new Promise( (resolve, reject) => {

      this.http.post(`${ REWORK_BACKEND_URL }/stripe/checkout-session`, data )
      .subscribe( ( res:ICheckoutSessionCreated ) => {

        console.log( res );

        if ( res.ok ) {

          resolve( res.id );

        } else {

          reject(`There's an error with stripe checkout`);
        }

      });


    });

  }

}
