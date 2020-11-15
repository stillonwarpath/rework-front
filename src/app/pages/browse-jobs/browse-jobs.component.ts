import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-browse-jobs',
  templateUrl: './browse-jobs.component.html',
  styleUrls: ['./browse-jobs.component.css']
})
export class BrowseJobsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Ejecutado');
  }

  apply() {
    console.log('Postular');
  }

}
