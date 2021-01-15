import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as classicEditor from '@ckeditor/ckeditor5-build-classic';
import { CheckboxComponent } from 'angular-bootstrap-md';


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
import { IFileValidation } from '../../interfaces/fileValidation.interface';
import { IBooster } from 'src/app/interfaces/boosters-request.interface';

declare const Stripe;

const URL = environment.rework_backend_url;
const STRIPE_PK = environment.stripe_pk;
const MAX_FILE_SIZE = environment.max_file_size;

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss']
})
export class PostJobComponent implements OnInit {

  @ViewChild('sticky') stickyCheck: CheckboxComponent;
  postFinalPrice: number = 0;
  editor = classicEditor;
  editorConfig: any = {
    placeholder:'Especifica mas información sobre el trabajo, responsabilidades, cualidades y como postular.',
    plugins:['Bold','Italic','Heading','List','Paragraph','Essentials']
  };
  texto = '';
  post_free = environment.post_free;
  stripe = Stripe(STRIPE_PK);
  newJobForm: FormGroup;
  categories: ICategory[] = [];
  boosters: any[] = [];
  types: IType[] = [];
  fileName = '';
  boostersSelected: string[] = [];
  selectedFile = undefined;
  loading = false;
  errorMessage: string = undefined;
  fileValidations: IFileValidation = {
    extension: undefined,
    fileSize: undefined,
    dimensions: undefined
  };

  displayUploadImageContainer = false;

  stickyOptions = [
    {
      code:'booster_2',
      name:'Fijado de 24 horas por',
    },
    {
      code:'booster_3',
      name:'Fijado de 7 días por',
    },
    {
      code:'booster_4',
      name:'Fijado de 30 días por',
    }
  ];

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
       description: new FormControl(null),
       url: new FormControl(null),
       email: new FormControl(null, [Validators.required, Validators.email ]),
       sticky: new FormControl()
    });

    this.boosterService.getBoosters()

        .then( boosters => {

          this.boosters = boosters;

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

  get description() {

    return this.newJobForm.get('description');

  }

  get sticky() {

    return this.newJobForm.get('sticky');

  }

  calculatePostFinalPrice() {

    console.log('Boosters:', this.boostersSelected);

    let boosterFound: IBooster = null;
    this.postFinalPrice = 4700;

    this.boostersSelected.forEach( boosterSelected => {

       boosterFound = this.boosterService.findById( this.boosters, boosterSelected );
       console.log('Booster found', boosterFound);
       this.postFinalPrice += boosterFound.price;

    });


    return this.postFinalPrice;

  }

  async onFileSelected( event, boosterCode: string ) {

    this.loading = true;
    this.selectedFile = event.target.files[0];

    if ( !this.selectedFile ) {

      this.loading = false;
      return;
      
    }

    const boosterImage = this.boosterService.find( this.boosters, boosterCode );
    this.boostersSelected.push( boosterImage._id );

    this.fileValidations = await this.fileService.validateFile( this.selectedFile );

    if ( this.fileService.fileHasError( this.fileValidations ) ) {

      this.loading = false;
      return;

    }

    try {

      this.fileName = await this.fileService.uploadFile( this.selectedFile );
      this.fileService.displayImagePreview('company-image', this.fileService.imgData );
      this.loading = false;

    } catch ( err ) {

      this.loading = false;

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

  checkAddImage( event ) {

    if ( !event.checked ) {

      this.removeFile('booster_1');
      this.displayUploadImageContainer = false;
    } else {
      this.displayUploadImageContainer = true;
    }

  }

  yellowPostCheckboxChange( event ) {

    const boosterId = this.boosterService.getId( this.boosters, 'booster_5' );

    if ( event.checked ) {

      this.boostersSelected.push( boosterId );

    } else {

      this.boostersSelected = this.boosterService.removeBoosterSelected( this.boostersSelected, boosterId  );

    }

  }

  stickyOptionsClicked( event: any ) {

    if ( event.checked ) {

      // Esteblece el primer sticky por defecto
      this.sticky.setValue(this.boosterService.getId( this.boosters, 'booster_2' ));
      this.boostersSelected.push( this.sticky.value );

    }
    
    if ( !event.checked && this.sticky.value ) {

      this.boostersSelected = this.boosterService.removeBoosterSelected( this.boostersSelected, this.sticky.value  );
      this.sticky.setValue( null );

    }


  }

  stickyRadioSelected( event: any ) {

      //TODO: Eliminar booster sticky previamente seleccionado
      this.boostersSelected.push( this.sticky.value );

  }

  // Pagar
  async pay() {

    this.loading = true;
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


    /*
    if ( this.sticky.value ) {

      this.boostersSelected.push( this.sticky.value );

    }
    */

    const job = new Job( this.company.value,
                         this.jobTitle.value,
                         this.category.value,
                         this.type.value,
                         this.location.value,
                         this.url.value,
                         this.email.value,
                         this.fileName,
                         this.boostersSelected,
                         this.description.value);

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
      this.errorMessage = `Hay un problema redirigiendo al checkout`;

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


      this.type.setErrors({
        required: true
      });

      return true;

    }

    return false;

  }

}
