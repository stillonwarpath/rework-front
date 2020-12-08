import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';

const URL = environment.rework_backend_url;

@Injectable({
  providedIn: 'root'
})
export class FileService {

  fileReader: FileReader = new FileReader();
  imgData: string;

  constructor( private http: HttpClient ) { }

  // Cargar archivo
  uploadFile( file: File ): Promise<string> {

    return new Promise( ( resolve, reject ) => {

      const fd = new FormData();

      fd.append('image', file, file.name );

      this.http.post(`${URL}/file`, fd, {
        reportProgress: true,
        observe: 'events'
      }).subscribe( (event: any) => {

        if ( event.type === HttpEventType.UploadProgress ) {

          const percentage = Math.round( (event.loaded / event.total ) * 100 ) + '%';

        } else if ( event.type === HttpEventType.Response ) {

          if ( event.body.ok ) {

            resolve( event.body.fileName );

          } else {

            reject(`Ocurrió un error subiendo archivo`);

          }

        }

      });

    });

  }

  // Obtener imagen
  getImage( files: File ): Promise<HTMLImageElement>  {

    return new Promise( (resolve, reject) => {

      this.fileReader.onload = ( e ) => {

        const img = new Image();

        img.onload = () => {

            resolve( img );

        };

        this.imgData = this.fileReader.result.toString();
        img.src = this.fileReader.result.toString();

      };

      this.fileReader.readAsDataURL( files ); // Convertir a base64

    });

  }


  // Mostrar preview de imagen
  displayImagePreview( elementId: string, data: string ) {

    document.getElementById(elementId).setAttribute('src', data );

  }

  // Validación extensión de archivo
  validFileExtension( fileType: string, validExtensions: string[] ) {

    const fileExtension = fileType.split('/')[1];
    let validFile = false;

    validExtensions.forEach( validExtension => {

        if ( validExtension === fileExtension ) {

          validFile = true;

        }

    });

    return validFile;

  }

  // Validación tamaño del archivo
  validFileSize( fileSize: number, maxFileSize: number ) {

    if ( fileSize <= maxFileSize ) {
      return true;
    } else {
      return false;
    }

  }

  // Validación de dimensiones de archivo
  validFileDimensions( width: number, height: number, validWidth: number, validHeight: number, isSquare = false) {


    // Validación sólo cuando se espera imagen cuadrada
    if ( isSquare ) {

      if ( width >= validWidth && height >= validHeight && width === height ) {

        return true;

      }

      return false;

    }

    // Validación para resto de imagenes
    if ( width >= validWidth && height >= validHeight ) {

      return true;

    }

    return false;

  }

}
