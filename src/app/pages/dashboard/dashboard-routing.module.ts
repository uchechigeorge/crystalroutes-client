import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';
import { EditTrackComponent } from 'src/app/components/edit-track/edit-track.component';
import { AddTrackComponent } from 'src/app/components/add-track/add-track.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  },
  {
    path: 'add',
    component: AddTrackComponent,
  },
  {
    path: 'edit/:id',
    component: EditTrackComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
