import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { Job } from '../../classes/job.class';
import { StripeService } from '../../services/stripe.service';
import { IJobCreated } from 'src/app/interfaces/posted-job.interface';
import { environment } from 'src/environments/environment';

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
  loading = false;
  errorMessage: string = undefined;

  constructor( private jobService: JobService,
               private stripeService: StripeService ) { }

  ngOnInit(): void {

    this.newJobForm = new FormGroup({
       company: new FormControl(null, Validators.required),
       jobTitle: new FormControl(null, Validators.required),
       category: new FormControl('-99', [Validators.required ]),
       type: new FormControl('-99', Validators.required),
       location: new FormControl(null, Validators.required),
       url: new FormControl(null, Validators.required),
       email: new FormControl(null, [Validators.required, Validators.email ]),
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
    let checkoutId: string;

    if ( this.newJobForm.invalid ) {
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

    if( result.error ) {

      this.loading = false;
      this.errorMessage = `There's a problem redirecting to checkout`;

    }

  }

}
