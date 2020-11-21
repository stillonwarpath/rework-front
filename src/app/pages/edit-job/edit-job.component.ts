import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../../interfaces/category.interface';
import { IType } from '../../interfaces/type.interface';
import { CategoryService } from '../../services/category.service';
import { TypeService } from '../../services/type.service';
import { JobService } from '../../services/job.service';
import { IJob } from '../../interfaces/job.interface';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnInit {

  jobId: string = undefined;
  editJobForm: FormGroup;
  categories: ICategory[] = [];
  types: IType[] = [];
  loading = false;
  result: any = {
    ok: undefined,
    message: undefined
  };

  constructor( private route: ActivatedRoute,
               private categoryService: CategoryService,
               private typeService: TypeService,
               private jobService: JobService ) { }

  ngOnInit(): void {

    this.editJobForm = new FormGroup({
      company: new FormControl(null, Validators.required),
      jobTitle: new FormControl(null, Validators.required),
      category: new FormControl('-99', Validators.required),
      type: new FormControl('-99', Validators.required),
      location: new FormControl(null),
      url: new FormControl(null, Validators.required),
   });

    this.categoryService.getCategories()
   .then( categories => {

     this.categories = categories;

   });

    this.typeService.getTypes()
    .then( types => {

      this.types = types;

    });


    this.route.paramMap.subscribe( (paramsMap: any) => {

      this.jobId = paramsMap.params.id;

      this.jobService.getJob( this.jobId)
          .then( job => {
              console.log( job );

              this.setCompany = job.company;
              this.setJobTitle = job.position;
              this.setCategory = job.category._id;
              this.setType = job.type._id;
              this.setLocation = job.location;
              this.setUrl = job.url;

          }).catch( err => {
              //TODO: desplegar mensaje
              console.log( err );
          });

    })

  }

  get company() {

    return this.editJobForm.get('company');

  }

  get jobTitle() {
    return this.editJobForm.get('jobTitle');
  }

  get category() {
    return this.editJobForm.get('category');
  }

  get type() {
    return this.editJobForm.get('type');
  }

  get location() {
    return this.editJobForm.get('location');
  }

  get url() {
    return this.editJobForm.get('url');
  }

  set setCompany( company: string ) {

    this.editJobForm.get('company').setValue( company );

  }

    
  set setJobTitle( jobTitle: string ) {

    this.editJobForm.get('jobTitle').setValue( jobTitle );

  }

  set setCategory( category: string ) {

    this.editJobForm.get('category').setValue( category );

  }

  set setType( type: string ) {

    this.editJobForm.get('type').setValue( type );

  }

  set setLocation( location: string ) {

    this.editJobForm.get('location').setValue( location );

  }

  set setUrl( url: string ) {

    this.editJobForm.get('url').setValue( url );
    
  }


  async edit() {

    if ( this.editJobForm.invalid ) {
      return;
    }

    const updatedJob: IJob = {
      _id: this.jobId,
      company: this.company.value,
      position: this.jobTitle.value,
      category: this.category.value,
      type: this.type.value,
      location: this.location.value,
      url: this.url.value,
    };

    try {

      await this.jobService.updateJob( updatedJob );
      this.result.ok = true;
      this.result.message = `The job was updated`;

    } catch ( err ) {

      this.result.ok = false;
      this.result.message = err;
    }

  }

}
