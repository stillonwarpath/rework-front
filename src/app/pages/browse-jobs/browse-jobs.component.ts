import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, EMPTY } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AnimationOptions } from 'ngx-lottie';
import Glide from '@glidejs/glide';


import { JobService } from '../../services/job.service';
import { CategoryService } from '../../services/category.service';
import { ICategory } from '../../interfaces/category.interface';
import { IJob } from 'src/app/interfaces/job.interface';
import { BoostersService } from '../../services/boosters.service';
import { IBooster } from 'src/app/interfaces/boosters-request.interface';

declare const fbq: any;
const ISPRODUCTION = environment.production;


@Component({
  selector: 'app-browse-jobs',
  templateUrl: './browse-jobs.component.html',
  styleUrls: ['./browse-jobs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BrowseJobsComponent implements OnInit {

  lottieOpttions: AnimationOptions = {
    path:'/assets/rework_home.json',
    loop: false
  };

  digitalOceanSpacesUrl: string = environment.digital_ocean_spaces;
  searchForm: FormGroup;
  $searchTerm = new Subject<string>();
  categories: ICategory[] = [];
  categorySelected: string = undefined;
  jobs: IJob[] = [];
  page = 1;
  searchTerm: string = undefined;
  moreJobs = true;
  indexJobClicked = undefined;
  boosters: IBooster[] = [];
  showModalGetBusinessPDF = true;
  jobIndexClicked: number = null;

  //Pixel Linkedin
  linkedinPixelSrcVisitas:string = '';
  linkedinPixelSrcFiltroCategorias: string = '';

  constructor( private jobService: JobService,
               private categoryService: CategoryService,
               public boostersService: BoostersService) { }

  ngOnInit() {


    if ( localStorage.getItem('see-modal-get-pdf') === 'false' ) {

      this.showModalGetBusinessPDF = false;
      
    }


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

    this.getJobs();


    this.categoryService.getCategories()
      .then( categories => {

        this.categories = categories; 

        setTimeout( () => {
          new Glide('.glide',{
            perView:4,
            //peek: { before: 0, after: 50 },
            breakpoints: {
              992: {
                perView: 3
              },
              576: {
                perView: 1
              }
            }
          }).mount();
        }, 1);

      });

      this.boostersService.getBoosters().then( boosters => {
        this.boosters = boosters;
      });
        
  }

  
   private getJobs() {

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

  }

  // Se filtran trabajos por categoría
  filterJobsByCategory( categoryId: string ) {
    
    // Si se selecciona nuevamente categoría se desactiva el filtro
    if ( categoryId === this.categorySelected ) {

      this.categorySelected = undefined;

    } else {

      this.categorySelected = categoryId;

    }

    fbq('track', 'jobCategorySelected');
    this.linkedinPixelSrcFiltroCategorias = 'https://px.ads.linkedin.com/collect/?pid=2781866&conversionId=3603962&fmt=gif';
    this.page = 1;
    this.jobs = [];


    this.getJobs();

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

    this.getJobs();
  
  }

  // Cargar más trabajos
  loadMoreJobs() {

    this.page++;
    this.getJobs();
  }


}
