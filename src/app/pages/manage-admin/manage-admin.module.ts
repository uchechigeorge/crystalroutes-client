import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageAdminPageRoutingModule } from './manage-admin-routing.module';

import { ManageAdminPage } from './manage-admin.page';
import { MaterialModule } from 'src/app/helpers/material.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageAdminPageRoutingModule,
    MaterialModule,
    ComponentsModule
  ],
  declarations: [ManageAdminPage]
})
export class ManageAdminPageModule {}
