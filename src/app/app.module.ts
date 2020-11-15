import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NabvarComponent } from './components/nabvar/nabvar.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowseJobsComponent } from './pages/browse-jobs/browse-jobs.component';
import { PostJobComponent } from './pages/post-job/post-job.component';

@NgModule({
  declarations: [
    AppComponent,
    NabvarComponent,
    BrowseJobsComponent,
    PostJobComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
