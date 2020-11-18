import { Component, OnInit } from '@angular/core';
import { IJobRequest } from 'src/app/interfaces/jobs-request.interface';
import { JobService } from '../../services/job.service';
import { CategoryService } from '../../services/category.service';
import { ICategory } from 'src/app/interfaces/categories-request.interface';
import { ActivatedRoute, Router } from '@angular/router';

declare var Splide;

@Component({
  selector: 'app-browse-jobs',
  templateUrl: './browse-jobs.component.html',
  styleUrls: ['./browse-jobs.component.css']
})
export class BrowseJobsComponent implements OnInit {

  categories: ICategory[] = [];
  categorySelected: string;
  jobs: IJobRequest[] = [];

  constructor( private jobService: JobService,
               private categoryService: CategoryService,
               private router: Router,
               private route: ActivatedRoute  ) { }

  ngOnInit() {

    // Acceso a los query params
    this.route.queryParams.subscribe( params => {
        console.log(params);

        this.jobService.getJobs( params.category ).
        then( jobs => {
          this.jobs = jobs;
        });

    });


    this.categoryService.getCategories()
      .then( categories => {

        this.categories = categories;
        console.log( this.categories );

      });

  }


  apply( url: string ) {
    
    //TODO: Navegar a url
    console.log( url );

  }

}
