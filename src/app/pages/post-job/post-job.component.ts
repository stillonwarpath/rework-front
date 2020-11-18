import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { Job } from '../../classes/job.class';
import { StripeService } from '../../services/stripe.service';
import { IJobCreated } from 'src/app/interfaces/posted-job.interface';
import { environment } from 'src/environments/environment';
import { CategoryService } from '../../services/category.service';
import { ICategory } from 'src/app/interfaces/categories-request.interface';
import { TypeService } from '../../services/type.service';
import { IType } from 'src/app/interfaces/types-request.interface';

declare const Stripe;

const STRIPE_PK = environment.stripe_pk;

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.css']
})
export class PostJobComponent implements OnInit {

  stripe = Stripe(STRIPE_PK);
  newJobForm: FormGroup;
  categories: ICategory[] = [];
  types: IType[] = [];
  loading = false;
  errorMessage: string = undefined;

  constructor( private jobService: JobService,
               private stripeService: StripeService,
               private categoryService: CategoryService,
               private typeService: TypeService ) { }

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

  async pay() {

    let createdJob:IJobCreated;

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
                         this.email.value);

    try {

      createdJob = await this.jobService.postJob( job );
      console.log(createdJob);

    } catch ( err ) {

      this.loading = false;
      this.errorMessage = err;
      return;

    }

    await this.stripeCheckout( createdJob._id );

  }

  private async stripeCheckout( jobId: string ) {

    let checkoutId: string;

    try {

      checkoutId = await this.stripeService.getCheckoutSession( jobId );

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
