import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageAdminPage } from './manage-admin.page';
import { AddAdminComponent } from 'src/app/components/add-admin/add-admin.component';

const routes: Routes = [
  {
    path: '',
    component: ManageAdminPage
  },
  {
    path: 'add',
    component: AddAdminComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAdminPageRoutingModule {}
