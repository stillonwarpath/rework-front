import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FileUploader } from 'ng2-file-upload';


import { JobService } from '../../services/job.service';
import { Job } from '../../classes/job.class';
import { StripeService } from '../../services/stripe.service';
import { CategoryService } from '../../services/category.service';
import { TypeService } from '../../services/type.service';
import { ICategory } from '../../interfaces/category.interface';
import { IType } from '../../interfaces/type.interface';
import { IPostedJob } from '../../interfaces/posted-job.interface';
import { FileService } from '../../services/file.service';
import { BoostersService } from '../../services/boosters.service';

declare const Stripe;

const URL = environment.rework_backend_url;
const STRIPE_PK = environment.stripe_pk;
const MAX_FILE_SIZE = environment.max_file_size;

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.css']
})
export class PostJobComponent implements OnInit {

  stripe = Stripe(STRIPE_PK);
  newJobForm: FormGroup;
  categories: ICategory[] = [];
  boosters: any[] = [];
  types: IType[] = [];
  fileName = '';
  boostersSelected: string[] = [];
  selectedFile = undefined;
  loadingFile = false;
  loading = false;
  errorMessage: string = undefined;
  fileValidations = {
    extension: undefined,
    fileSize: undefined,
    dimensions: undefined
  };

  constructor( private jobService: JobService,
               private stripeService: StripeService,
               private categoryService: CategoryService,
               private typeService: TypeService,
               private router: Router,
               private fileService: FileService,
               public boosterService: BoostersService ) { }

  async ngOnInit() {

    this.newJobForm = new FormGroup({
       company: new FormControl(null, Validators.required),
       jobTitle: new FormControl(null, Validators.required),
       category: new FormControl('-99', Validators.required),
       type: new FormControl('-99', Validators.required),
       location: new FormControl(null),
       url: new FormControl(null, Validators.required),
       email: new FormControl(null, [Validators.required, Validators.email ]),
    });

    this.boosterService.getBoosters()
        .then( boosters => {

          this.boosters = boosters;
          console.log( this.boosters );

        });

    this.categoryService.getCategories()
      .then( categories => {

        this.categories = categories;

      });

    this.typeService.getTypes()
       .then( types => {

         this.types = types;

       });

 
  }

  get company() {

    return this.newJobForm.get('company');

  }

  get jobTitle() {

    return this.newJobForm.get('jobTitle');

  }

  get category() {

    return this.newJobForm.get('category');

  }

  get type() {

    return this.newJobForm.get('type');

  }


  get location() {

    return this.newJobForm.get('location');

  }
  get url() {

    return this.newJobForm.get('url');

  }

  get email() {

    return this.newJobForm.get('email');

  }

  async onFileSelected( event, boosterCode: string ) {

  
    const boosterImage = this.boosterService.find( this.boosters, boosterCode );
    this.boostersSelected.push( boosterImage._id );
    this.loadingFile = true;
    this.selectedFile = event.target.files[0];

    if ( !this.selectedFile ) {

      console.log('No se seleccionó archivo');
      this.loadingFile = false;
      return;
      
    }

    if ( !this.fileService.validFileExtension( this.selectedFile.type, [ 'jpeg', 'png' ] )) {

      this.loadingFile = false;
      this.fileValidations.extension = false;
      console.log('Extensión no válida');
      return;

    }

    this.fileValidations.extension = true;

    if ( !this.fileService.validFileSize( this.selectedFile.size, MAX_FILE_SIZE ) ) {

      this.loadingFile = false;
      this.fileValidations.fileSize = false;
      console.log('Tamaño de archivo no válido');
      return;

    }

    this.fileValidations.fileSize = true;


    const image = await this.fileService.getImage( this.selectedFile );

    if ( !this.fileService.validFileDimensions( image.width, image.height, 150, 150, true) ) {

      this.loadingFile = false;
      this.fileValidations.dimensions = false;
      console.log('Dimensiones de archivo no válidos');
      return;

    }

    this.fileValidations.dimensions = true;

    try {

      this.fileName = await this.fileService.uploadFile( this.selectedFile );
      console.log('File name:', this.fileName);
      this.fileService.displayImagePreview('company-image', this.fileService.imgData );
      this.loadingFile = false;

    } catch ( err ) {

      console.log('Error:', err.message);
      this.loadingFile = false;

    }

  }

  removeFile( boosterCode: string ) {

    this.fileName = '';
    this.fileService.displayImagePreview('company-image', null);
    const boosterImage = this.boosterService.find( this.boosters, boosterCode );
    this.boostersSelected = this.boostersSelected.filter( boosterId => boosterId !== boosterImage._id );
    this.fileValidations.extension = undefined;
    this.fileValidations.fileSize = undefined;
    this.fileValidations.dimensions = undefined;

  }

  async pay() {

    let result: IPostedJob;

    if ( this.newJobForm.invalid ) {
      return;
    }

    if ( this.invalidCategory() ) {
      return;
    }

    if ( this.invalidType() ) {
      return;
    }

    this.loading = true;

    const job = new Job( this.company.value,
                         this.jobTitle.value,
                         this.category.value,
                         this.type.value,
                         this.location.value,
                         this.url.value,
                         this.email.value,
                         this.fileName,
                         this.boostersSelected );

    try {

      result = await this.jobService.postJob( job );

      if ( result.free === 'true' ) {
        // Si publicación es gratis envía a página de pago exitoso
        this.router.navigateByUrl('/successful-payment');

      } else {

        // Si publicación requiere pago enviar al checkout de Stripe
        await this.stripeCheckout( result.job._id );

      }


    } catch ( err ) {

      this.loading = false;
      this.errorMessage = err;

    }


  }

  private async stripeCheckout( jobId: string ) {

    let checkoutId: string;

    try {

      checkoutId = await this.stripeService.getCheckoutSession( jobId, this.boostersSelected );

    } catch ( err ) {

      this.loading = false;
      this.errorMessage = err;
      return;

    }

    const result = this.stripe.redirectToCheckout({ sessionId: checkoutId });

    this.newJobForm.reset();

    if( result.error ) {

      this.loading = false;
      this.errorMessage = `There's a problem redirecting to checkout`;

    }

  }

  // Validación de categoría
  private invalidCategory() {

    if ( this.category.value === '-99' ) {

      this.category.setErrors({
        required: true
      });

      return true;

    }

    return false;

  }

  // Validación de tipo
  private invalidType() {

    if ( this.type.value === '-99' ) {

      console.log('tipo inválido');


      this.type.setErrors({
        required: true
      });

      return true;

    }

    return false;

  }

}
