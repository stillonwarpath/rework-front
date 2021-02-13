import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as classicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';


import { ICategory } from '../../interfaces/category.interface';
import { IType } from '../../interfaces/type.interface';
import { CategoryService } from '../../services/category.service';
import { TypeService } from '../../services/type.service';
import { JobService } from '../../services/job.service';
import { IJob } from '../../interfaces/job.interface';
import { IBooster } from 'src/app/interfaces/boosters-request.interface';
import { BoostersService } from '../../services/boosters.service';
import { FileService } from 'src/app/services/file.service';
import { IFileValidation } from '../../interfaces/fileValidation.interface';

const MAX_FILE_SIZE = environment.max_file_size;


@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.scss']
})
export class EditJobComponent implements OnInit {

  @ViewChild('tag') tag: any;
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

  fileValidations: IFileValidation = {
    extension: undefined,
    fileSize: undefined,
    dimensions: undefined
  };
  
  editorConfig: any = {
    placeholder:'Especifica mas información sobre el trabajo, responsabilidades, cualidades y como postular.',
    plugins:['Bold','Italic','Heading','List','Paragraph','Essentials']
  };


  result: any = {
    ok: undefined,
    message: undefined
  };

  tagsAdded: string[] = [];


  constructor( private route: ActivatedRoute,
               private categoryService: CategoryService,
               private typeService: TypeService,
               private jobService: JobService,
               public boosterService: BoostersService,
               private fileService: FileService,
               private toastService: ToastrService ) { }

  ngOnInit(): void {

    this.editJobForm = new FormGroup({
      company: new FormControl(null, Validators.required),
      jobTitle: new FormControl(null, Validators.required),
      category: new FormControl('-99', Validators.required),
      type: new FormControl('-99', Validators.required),
      description: new FormControl(null),
      location: new FormControl(null),
      url: new FormControl(null),
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
              this.tagsAdded = job.tags;

              console.log(this.tagsAdded);
          

          }).catch( err => {

              console.log( err.message );
              //TODO: desplegar mensaje
              this.showForm = false;
              this.result.ok = false;
              this.result.message = 'La postulación no puede ser actualizada en este momento.';
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

  public addTag( event: any, tag: string) {

   this.jobService.addTagToJob( event.keyCode, tag, this.tag, this.tagsAdded );

  }

  public removeTag( index ) {

    this.jobService.removeAddedTagToJob( index, this.tagsAdded );

  }

  // Cargar archivo
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
      tags: this.tagsAdded,
      category: this.category.value,
      type: this.type.value,
      description: this.description.value,
      location: this.location.value,
      url: this.url.value,
      companyImage: this.fileName
    };

    try {

      await this.jobService.updateJob( updatedJob );

      this.toastService.success('El trabajo ha sido editado.','',{
        timeOut: 7000,
        positionClass: 'toast-top-center' 
      });

    } catch ( err ) {

       this.toastService.error('Sucedió un error editando el trabajo.','',{
        timeOut: 7000,
        positionClass: 'toast-top-center' 
      });

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
