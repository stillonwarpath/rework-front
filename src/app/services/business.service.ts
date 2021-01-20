import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URL = environment.rework_backend_url;


@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor( private http: HttpClient ) { }

  createLead( businessEmail: string, businessName: string ) {
    
    const business = {
      company: businessEmail,
      email: businessName
    };

    return new Promise( (resolve, reject) => {

      this.http.post(`${URL}/company/lead`, business)
      .subscribe( (res: any) => {
        
        if ( res.ok ) {
            resolve(null);
        } else {
            reject(null);
        }

      });
  

    });


  }

}
