import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, EMPTY } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ICategory } from '../../interfaces/category.interface';
import { IJob } from 'src/app/interfaces/job.interface';


@Component({
  selector: 'app-browse-jobs',
  templateUrl: './browse-jobs.component.html',
  styleUrls: ['./browse-jobs.component.css']
})
export class BrowseJobsComponent implements OnInit {

  searchForm: FormGroup;
  $searchTerm = new Subject<string>();
  categories: ICategory[] = [];
  categorySelected: string = undefined;
  jobs: IJob[] = [];
  page = 1;
  searchTerm: string = undefined;
  moreJobs = true;

  constructor( private jobService: JobService,
               private categoryService: CategoryService,
               private router: Router,
               private route: ActivatedRoute  ) { }

  ngOnInit() {

    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });

    this.$searchTerm.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap( term => {

          this.searchJobs( term.trim() );
          return EMPTY;

        })
        ).subscribe();

    // Acceso a los query params
    this.route.queryParams.subscribe( params => {

      this.page = params.page;
      this.categorySelected = params.category;
      this.searchTerm = params.search;

      this.jobService.getJobs( this.page, this.categorySelected, this.searchTerm ).
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
    this.jobs = [];
    this.categorySelected = categoryId;

    // tslint:disable-next-line: max-line-length
    this.router.navigate(['/browse-jobs'], { queryParams: { search: this.searchTerm, category: this.categorySelected, page: this.page }, queryParamsHandling: 'merge'});

  }

  // Búsqueda de trabajos por término de búsqueda
  searchJobs( term: string){

    this.page = 1;
    this.jobs = [];

    if ( term.length === 0 ) {

      this.searchTerm = undefined;

    } else {

      this.searchTerm = term;

    }

    // tslint:disable-next-line: max-line-length
    this.router.navigate(['/browse-jobs'], { queryParams: { search: this.searchTerm, category: this.categorySelected, page: this.page }, queryParamsHandling: 'merge'});



  }


  // Click en aplicar para abrir url de trabajo
  apply( url: string ) {

    //TODO: Navegar a url
    console.log( url );

  }

  // Cargar más trabajos
  loadMoreJobs() {

    this.page++;
    // tslint:disable-next-line: max-line-length
    this.router.navigate(['/browse-jobs'], { queryParams: { search: this.searchTerm, category: this.categorySelected, page: this.page }, queryParamsHandling: 'merge'});

  }

}
