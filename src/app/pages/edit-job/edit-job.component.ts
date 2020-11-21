import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../../interfaces/categories-request.interface';
import { IType } from '../../interfaces/types-request.interface';
import { CategoryService } from '../../services/category.service';
import { TypeService } from '../../services/type.service';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnInit {

  editJobForm: FormGroup;
  categories: ICategory[] = [];
  types: IType[] = [];
  loading = false;

  constructor( private route: ActivatedRoute,
               private categoryService: CategoryService,
               private typeService: TypeService ) { }

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


    this.route.paramMap.subscribe( (paramsMap:any) => {
      console.log( paramsMap.params.id );
    })

  }

  edit() {
    
  }

}
