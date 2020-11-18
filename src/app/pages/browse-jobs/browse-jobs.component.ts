import { Component, OnInit } from '@angular/core';
import { IJobRequest } from 'src/app/interfaces/jobs-request.interface';
import { JobService } from '../../services/job.service';
import { CategoryService } from '../../services/category.service';
import { ICategory } from 'src/app/interfaces/categories-request.interface';

declare var Splide;

@Component({
  selector: 'app-browse-jobs',
  templateUrl: './browse-jobs.component.html',
  styleUrls: ['./browse-jobs.component.css']
})
export class BrowseJobsComponent implements OnInit {

  categories: ICategory[] = [];
  jobs: IJobRequest[] = [];

  constructor( private jobService: JobService,
               private categoryService: CategoryService  ) { }

  ngOnInit() {

    this.jobService.getJobs().
       then( jobs => {
         this.jobs = jobs;
       });

    
    this.categoryService.getCategories()
      .then( categories => {
        
        this.categories = categories;
        console.log( this.categories );

      });

  }

  // Filtrar trabajos por categoría
  async filterJobsByCategory( categoryId: string ) {

    this.jobs = await this.jobService.getJobs( categoryId );

  }


  apply( url: string ) {
    
    //TODO: Navegar a url
    console.log( url );

  }

}
