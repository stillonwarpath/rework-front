import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { Job } from '../../classes/job.class';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.css']
})
export class PostJobComponent implements OnInit {

  newJobForm: FormGroup;
  errorMessage: string = undefined;

  constructor( private jobService: JobService ) { }

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

    if ( this.newJobForm.invalid ) {
      return;
    }

    const job = new Job( this.company.value,
                         this.jobTitle.value,
                         this.category.value,
                         this.type.value,
                         this.location.value,
                         this.url.value,
                         this.email.value);
    
    try {

      const createdJob = await this.jobService.postJob( job );
      console.log(createdJob);
      
    } catch ( err ) {

      console.log(  err );
      this.errorMessage = err;

    } 

    //TODO: Crear sesión de checkout Stripe


  }

}
