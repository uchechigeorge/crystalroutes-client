import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackerPageRoutingModule } from './tracker-routing.module';

import { TrackerPage } from './tracker.page';
import { MaterialModule } from 'src/app/helpers/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackerPageRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [TrackerPage]
})
export class TrackerPageModule {}
