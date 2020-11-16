import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IJob } from '../classes/job.class';

const REWORK_BACKEND_URL = environment.rework_backend_url;

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor( private http: HttpClient ) { }

  // Crear nuevo post
  postJob( job: IJob ) {

    this.http.post(`${ REWORK_BACKEND_URL }/job`, job)
      .subscribe( res => {
        console.log( res );
      });

  }

}
