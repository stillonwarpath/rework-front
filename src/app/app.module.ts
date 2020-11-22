import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { NabvarComponent } from './components/nabvar/nabvar.component';
import { BrowseJobsComponent } from './pages/browse-jobs/browse-jobs.component';
import { PostJobComponent } from './pages/post-job/post-job.component';
import { LocationsSplitPipe } from './pipes/locations-split.pipe';
import { EditJobComponent } from './pages/edit-job/edit-job.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { SuccessfulPaymentComponent } from './pages/successful-payment/successful-payment.component';
import { PaymentCanceledComponent } from './pages/payment-canceled/payment-canceled.component';

@NgModule({
  declarations: [
    AppComponent,
    NabvarComponent,
    BrowseJobsComponent,
    PostJobComponent,
    LocationsSplitPipe,
    EditJobComponent,
    TimeAgoPipe,
    SuccessfulPaymentComponent,
    PaymentCanceledComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
