import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackerPageRoutingModule } from './tracker-routing.module';

import { TrackerPage } from './tracker.page';
import { MaterialModule } from 'src/app/helpers/material.module';
import { LoginPageComponent } from 'src/app/components/test/test.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackerPageRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [TrackerPage, LoginPageComponent],
})
export class TrackerPageModule {}
