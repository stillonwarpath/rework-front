import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IBooster, IBoostersRequest } from '../interfaces/boosters-request.interface';

const URL = environment.rework_backend_url;

@Injectable({
  providedIn: 'root'
})
export class BoostersService {

  constructor( private http: HttpClient ) { }

  // Obtener listado de boosters disponibles
  getBoosters(): Promise<IBooster[]> {

    return new Promise( (resolve, reject) => {

      this.http.get<IBooster>(`${URL}/booster`).subscribe( (res: any) => {

         resolve( res.boosters );
  
      });

    });

  }

  // Buscar booster
  find( boosters: IBooster[], codeSearched: string ): IBooster | undefined {

    return boosters.find( booster => booster.code === codeSearched );

  }

  getPrice( boosters: IBooster[], codeSearched: string  ): number | undefined {

    return boosters.find( booster => booster.code === codeSearched ).price;

  }

  getId( boosters: IBooster[], codeSearched: string  ): string | undefined {

    return boosters.find( booster => booster.code === codeSearched )._id;

  }

}
