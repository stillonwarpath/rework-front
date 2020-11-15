import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseJobsComponent } from './pages/browse-jobs/browse-jobs.component';
import { PostJobComponent } from './pages/post-job/post-job.component';


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
    path:'**',
    pathMatch: 'full',
    redirectTo: 'browse-jobs'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
