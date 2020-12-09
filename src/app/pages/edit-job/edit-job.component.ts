import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as classicEditor from '@ckeditor/ckeditor5-build-classic';


import { ICategory } from '../../interfaces/category.interface';
import { IType } from '../../interfaces/type.interface';
import { CategoryService } from '../../services/category.service';
import { TypeService } from '../../services/type.service';
import { JobService } from '../../services/job.service';
import { IJob } from '../../interfaces/job.interface';
import { IBooster } from 'src/app/interfaces/boosters-request.interface';
import { BoostersService } from '../../services/boosters.service';
import { FileService } from 'src/app/services/file.service';

const MAX_FILE_SIZE = environment.max_file_size;


@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.scss']
})
export class EditJobComponent implements OnInit {

  editor = classicEditor;
  showForm = true;
  jobId: string = undefined;
  editJobForm: FormGroup;
  categories: ICategory[] = [];
  types: IType[] = [];
  loading = false;
  fileName = '';
  companyImg = '';
  boosters: IBooster[] = [];
  boostersSelected: string[] = [];
  selectedFile = undefined;
  fileValidations = {
    extension: undefined,
    fileSize: undefined,
    dimensions: undefined
  };
  loadingFile = false;
  editorConfig: any = {
    placeholder:'Specify more information about the job, responsibilities, qualifications and how to apply.',
    plugins:['Bold','Italic','Heading','List','Paragraph','Essentials']
  };


  result: any = {
    ok: undefined,
    message: undefined
  };

  constructor( private route: ActivatedRoute,
               private categoryService: CategoryService,
               private typeService: TypeService,
               private jobService: JobService,
               public boosterService: BoostersService,
               private fileService: FileService ) { }

  ngOnInit(): void {

    this.editJobForm = new FormGroup({
      company: new FormControl(null, Validators.required),
      jobTitle: new FormControl(null, Validators.required),
      category: new FormControl('-99', Validators.required),
      type: new FormControl('-99', Validators.required),
      description: new FormControl(null),
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


              this.setCompany = job.company;
              this.setJobTitle = job.position;
              this.setCategory = job.category._id;
              this.setType = job.type._id;
              this.setLocation = job.location;
              this.setUrl = job.url;
              this.fileName = job.companyImage;
              this.companyImg = job.companyImage;
              this.boosters = job.boosters;
              this.setDescription = job.description || '';
          

          }).catch( err => {

              console.log( err.message );
              //TODO: desplegar mensaje
              this.showForm = false;
              this.result.ok = false;
              this.result.message = 'The job cannot be updated at this moment.';
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

  get description() {
    return this.editJobForm.get('description');
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

  set setDescription( description: string ) {
    this.editJobForm.get('description').setValue( description );
  }

  // Cargar archivo
  async onFileSelected( event, boosterCode: string ) {

  
    const boosterImage = this.boosterService.find( this.boosters, boosterCode );
    this.boostersSelected.push( boosterImage._id );
    this.loadingFile = true;
    this.selectedFile = event.target.files[0];

    if ( !this.selectedFile ) {

      this.loadingFile = false;
      return;
      
    }

    if ( !this.fileService.validFileExtension( this.selectedFile.type, [ 'jpeg', 'png' ] )) {

      this.loadingFile = false;
      this.fileValidations.extension = false;
      return;

    }

    this.fileValidations.extension = true;

    if ( !this.fileService.validFileSize( this.selectedFile.size, MAX_FILE_SIZE ) ) {

      this.loadingFile = false;
      this.fileValidations.fileSize = false;
      return;

    }

    this.fileValidations.fileSize = true;


    const image = await this.fileService.getImage( this.selectedFile );

    if ( !this.fileService.validFileDimensions( image.width, image.height, 150, 150, true) ) {

      this.loadingFile = false;
      this.fileValidations.dimensions = false;
      return;

    }

    this.fileValidations.dimensions = true;

    try {

      this.fileName = await this.fileService.uploadFile( this.selectedFile );
      this.fileService.displayImagePreview('company-image', this.fileService.imgData );
      this.loadingFile = false;

    } catch ( err ) {

      this.loadingFile = false;

    }

  }

  // Remover archivo cargado
  removeFile( boosterCode: string ) {

    this.fileName = '';
    this.fileService.displayImagePreview('company-image', null);
    const boosterImage = this.boosterService.find( this.boosters, boosterCode );
    this.boostersSelected = this.boostersSelected.filter( boosterId => boosterId !== boosterImage._id );
    this.fileValidations.extension = undefined;
    this.fileValidations.fileSize = undefined;
    this.fileValidations.dimensions = undefined;

  }


  // Click al botón editar
  async edit() {

    if ( this.editJobForm.invalid ) {
      return;
    }

    if ( this.invalidCategory() ) {
      return;
    }

    if ( this.invalidType() ) {
      return;
    }

    this.loading = true;

    const updatedJob: IJob = {
      _id: this.jobId,
      company: this.company.value,
      position: this.jobTitle.value,
      category: this.category.value,
      type: this.type.value,
      description: this.description.value,
      location: this.location.value,
      url: this.url.value,
      companyImage: this.fileName
    };

    console.log('Job:', updatedJob);

    try {

      await this.jobService.updateJob( updatedJob );
      this.result.ok = true;
      this.result.message = `The job was updated`;

    } catch ( err ) {

      this.result.ok = false;
      this.result.message = err;
    }

    this.loading = false;

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
