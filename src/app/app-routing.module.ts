import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseJobsComponent } from './pages/browse-jobs/browse-jobs.component';
import { PostJobComponent } from './pages/post-job/post-job.component';
import { EditJobComponent } from './pages/edit-job/edit-job.component';
import { SuccessfulPaymentComponent } from './pages/successful-payment/successful-payment.component';
import { PaymentCanceledComponent } from './pages/payment-canceled/payment-canceled.component';
import { TerminosCondicionesComponent } from './pages/terminos-condiciones/terminos-condiciones.component';
import { PoliticaDePrivacidadComponent } from './pages/politica-de-privacidad/politica-de-privacidad.component';
import { FaqComponent } from './pages/faq/faq.component';


const routes: Routes = [
  {
    path: 'browse-jobs',
    component: BrowseJobsComponent
  },
  {
    path: 'post-job',
    component: PostJobComponent
  },
  {
    path: 'edit-job/:id',
    component: EditJobComponent
  },
  {
    path: 'successful-payment',
    component: SuccessfulPaymentComponent
  },
  {
    path:'payment-canceled',
    component: PaymentCanceledComponent
  },
  {
    path: 'terminos-y-condiciones',
    component: TerminosCondicionesComponent
  },
   {
    path: 'politica-de-privacidad',
    component: PoliticaDePrivacidadComponent
  },
  {
    path: 'preguntas-frecuentes',
    component: FaqComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'browse-jobs'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
