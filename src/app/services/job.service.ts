import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IJob } from '../interfaces/job.interface';
import { IPostedJob } from '../interfaces/posted-job.interface';
import { IJobsRequest } from '../interfaces/jobs-request.interface';
import { IJob as IJobObj } from '../classes/job.class';
import { IJobRequest } from '../interfaces/job-request.interface';
import { IJobUpdated } from '../interfaces/job-updated.interface';


const REWORK_BACKEND_URL = environment.rework_backend_url;

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor( private http: HttpClient ) { }

  // Crear nuevo post
  postJob( job: IJobObj ): Promise<IPostedJob> {

    return new Promise( ( resolve, reject ) => {

      this.http.post(`${ REWORK_BACKEND_URL }/job`, job)
      .subscribe( (res: IPostedJob) => {

        if ( res.ok ) {

            resolve( res );

        }
        else {

            reject(`The job couldn't be post`);

        }

      });

    });


  }

  // Obtener trabajo por id
  getJob( jobId: string ): Promise<IJob> {

    return new Promise<IJob>( ( resolve, reject ) => {

      this.http.get(`${ REWORK_BACKEND_URL }/job/${ jobId }`)
      .subscribe( (res: IJobRequest ) => {

        if ( res.ok ) {

          resolve( res.job );

        } else {

          reject(`Can't edit this job`);

        }

      });

    });

  }

  // Obtener trabajos
  getJobs( page: number = 1, categoryId?: string, search?: string ): Promise<IJob[]> {

    let query = `/job?page=${page}`;

    if ( categoryId ) {

      query += `&category=${categoryId}`;

    }

    if ( search ) {

      query += `&search=${search}`;

    }

    return new Promise<IJob[]>( (resolve, reject) => {

      this.http.get(`${ REWORK_BACKEND_URL }${query}`)
      .subscribe( (res: IJobsRequest ) => {

        resolve( res.jobs );

      });

    });


  }

  // Actualizar trabajo
  // tslint:disable-next-line: typedef
  updateJob( updatedJob: IJob ) {

    return new Promise( (resolve, reject) => {

      this.http.put(`${ REWORK_BACKEND_URL }/job/${ updatedJob._id }`, updatedJob)
      .subscribe( (res: IJobUpdated) => {

        if ( res.ok ) {

          resolve(true);

        } else {

          reject(`The job couldn't be updated`);

        }

      });

    });

  }


}
