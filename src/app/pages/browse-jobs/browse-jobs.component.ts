import { Component, OnInit } from '@angular/core';
import { IJobRequest } from 'src/app/interfaces/jobs-request.interface';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-browse-jobs',
  templateUrl: './browse-jobs.component.html',
  styleUrls: ['./browse-jobs.component.css']
})
export class BrowseJobsComponent implements OnInit {

  jobs: IJobRequest[] = [];

  constructor( private jobService: JobService  ) { }

  async ngOnInit() {

   this.jobs = await this.jobService.getJobs();
   console.log( this.jobs );

  }

  apply( url: string ) {
    
    //TODO: Navegar a url
    console.log( url );

  }

}
