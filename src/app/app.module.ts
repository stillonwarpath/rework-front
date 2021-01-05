import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ToastrModule } from 'ngx-toastr';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LottieModule } from 'ngx-lottie';
/*import player from 'lottie-web';*/


import { NabvarComponent } from './components/nabvar/nabvar.component';
import { BrowseJobsComponent } from './pages/browse-jobs/browse-jobs.component';
import { PostJobComponent } from './pages/post-job/post-job.component';
import { LocationsSplitPipe } from './pipes/locations-split.pipe';
import { EditJobComponent } from './pages/edit-job/edit-job.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { SuccessfulPaymentComponent } from './pages/successful-payment/successful-payment.component';
import { PaymentCanceledComponent } from './pages/payment-canceled/payment-canceled.component';
import { ImageUrlPipe } from './pipes/image-url.pipe';
import { CompanyAbbreviationPipe } from './pipes/company-abbreviation.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { TerminosCondicionesComponent } from './pages/terminos-condiciones/terminos-condiciones.component';
import { PoliticaDePrivacidadComponent } from './pages/politica-de-privacidad/politica-de-privacidad.component';
import { FaqComponent } from './pages/faq/faq.component';
import { FormatPricePipe } from './pipes/format-price.pipe';

// Carga lottie-web bajo demanda cuando se carga animación por primera vez
export function playerFactory() {
  return import(/* webPackChunkName: 'Lottie-web' */ 'lottie-web');
}

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
    PaymentCanceledComponent,
    ImageUrlPipe,
    CompanyAbbreviationPipe,
    FooterComponent,
    TerminosCondicionesComponent,
    PoliticaDePrivacidadComponent,
    FaqComponent,
    FormatPricePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CKEditorModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
