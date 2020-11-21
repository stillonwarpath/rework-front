import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ICategoriesRequest } from '../interfaces/categories-request.interface';
import { ICategory } from '../interfaces/category.interface';

const REWORK_BACKEND_URL = environment.rework_backend_url;


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor( private http: HttpClient ) { }

  // Obtener categorías
  getCategories(): Promise<ICategory[]> {

    return new Promise<ICategory[]>( ( resolve, reject ) => {

      this.http.get(`${ REWORK_BACKEND_URL }/category`)
      .subscribe( (res: ICategoriesRequest ) => {

        resolve( res.categories );

      });

    });

  }

}
