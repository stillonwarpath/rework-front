import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URL = environment.rework_backend_url;

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor( private http: HttpClient ) { }

  // Cargar archivo
  uploadFile( file: File ) {

    const fd = new FormData();
    fd.append('image', file, file.name );

    this.http.post(`${URL}/file`, fd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe( event => {

      if ( event.type === HttpEventType.UploadProgress ) {

        const percentage = Math.round( (event.loaded / event.total ) * 100 ) + '%';
        console.log(`Upload progress: ${ percentage }`);

      } else if ( event.type === HttpEventType.Response ) {

        console.log( event );

      }

    })

  }

}
