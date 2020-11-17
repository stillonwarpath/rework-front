import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IJob } from '../classes/job.class';
import { IJobCreated, IPostedJob } from '../interfaces/posted-job.interface';

const REWORK_BACKEND_URL = environment.rework_backend_url;

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor( private http: HttpClient ) { }

  // Crear nuevo post
  postJob( job: IJob ): Promise<IJobCreated> {

    return new Promise( ( resolve, reject ) => {

      this.http.post(`${ REWORK_BACKEND_URL }/job`, job)
      .subscribe( (res: IPostedJob) => {
        console.log( res );

        if ( res.ok ) {

            resolve( res.job );

        }
        else {

            reject(`The job couldn't be post`);

        }

      });

    });


  }

}
