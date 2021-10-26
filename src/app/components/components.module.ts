import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { TrackCardsComponent } from './track-cards/track-cards.component';
import { MaterialModule } from '../helpers/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditTrackComponent } from './edit-track/edit-track.component';
import { AddTrackComponent } from './add-track/add-track.component';
import { AddAdminComponent } from './add-admin/add-admin.component';

@NgModule({
  declarations: [
    TrackCardsComponent,
    EditTrackComponent,
    AddTrackComponent,
    AddAdminComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    TrackCardsComponent,
    
  ]
})
export class ComponentsModule { }
