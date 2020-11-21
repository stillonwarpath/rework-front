import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ITypesRequest } from '../interfaces/types-request.interface';
import { IType } from '../interfaces/type.interface';

const REWORK_BACKEND_URL = environment.rework_backend_url;

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  constructor( private http: HttpClient ) { }

  // Obtener los tipos de trabajo
  getTypes(): Promise<IType[]> {

    return new Promise<IType[]>( (resolve, reject) => {

      this.http.get(`${ REWORK_BACKEND_URL }/type`)
      .subscribe( (res: ITypesRequest ) => {

          resolve( res.types );

      });

    });


  }

}
