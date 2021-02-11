import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoostersService } from '../../services/boosters.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  @Input('job') job: any;
  @Input('jobIndex') jobIndex: number;
  @Input('jobIndexClicked') jobIndexClicked: number;
  @Output() 
  jobClicked: EventEmitter<number> = new EventEmitter<number>();

  constructor(public boostersService: BoostersService) { }

  ngOnInit(): void {
  }

  // Click para mostrar o cerrar trabajo
  clickJob() {

    if (!this.job.description) {
      this.apply( this.job.url );
      return;
    }

    if ( this.jobIndexClicked === this.jobIndex ) {
      this.jobIndexClicked = null;
    } else {
      this.jobIndexClicked = this.jobIndex;
    }

    this.jobClicked.emit(this.jobIndexClicked);  

  }

  private apply( url: string ) {

    url = `http://${url}`;
    window.open( url, '_blank');


  }

}
