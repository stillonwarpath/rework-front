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
  page = 1;
  moreJobs = true;

  constructor( private jobService: JobService,
               private categoryService: CategoryService,
               private router: Router,
               private route: ActivatedRoute  ) { }

  ngOnInit() {

    // Acceso a los query params
    this.route.queryParams.subscribe( params => {
    
        this.categorySelected = params.category;
    
        this.jobService.getJobs( params.page, params.category ).
        then( jobs => {

          console.log( jobs );

          if ( jobs.length === 0 ) {

            this.moreJobs = false;

          } else {

            this.jobs.push(...jobs);
            this.moreJobs = true;

          }

        });

    });


    this.categoryService.getCategories()
      .then( categories => {

        this.categories = categories;
        console.log( this.categories );

      });

  }

  // Se filtran trabajos por categoría
  filterJobsByCategory( categoryId: string ) {

    this.page = 1;
    this.categorySelected = categoryId;
    this.jobs = [];

    this.router.navigate(['/browse-jobs'], { queryParams: { category: categoryId }});

  }


  // Click en aplicar para abrir url de trabajo
  apply( url: string ) {
    
    //TODO: Navegar a url
    console.log( url );

  }

  // Cargar más trabajos
  loadMoreJobs() {

    this.page++;
    this.router.navigate(['/browse-jobs'], { queryParams: { page: this.page }, queryParamsHandling:'merge' });

  }

}
