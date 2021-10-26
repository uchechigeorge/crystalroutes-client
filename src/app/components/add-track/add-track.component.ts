import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { requiredField, negativeValidator } from 'src/app/helpers/input-validators';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-track',
  templateUrl: './add-track.component.html',
  styleUrls: ['./add-track.component.scss'],
})
export class AddTrackComponent implements OnInit {

  id = "";
  details: any = {};
  loadingTrack = true;
  editing = false;
  btnText = "Add";
  errText = "";

  formGroup = new FormGroup({
    origin: new FormControl('', [requiredField, Validators.required]),
    destination: new FormControl('', [requiredField, Validators.required]),
    shipVia: new FormControl('', [requiredField, Validators.required]),
    deliveryFees: new FormControl('', [ requiredField, Validators.required ]),
    shippingDate: new FormControl('',),
    deliveryDate: new FormControl('',),
    senderName: new FormControl(''),
    senderPhone: new FormControl(''),
    senderAddress: new FormControl(''),
    senderEmail: new FormControl(''),
    receiverName: new FormControl(''),
    receiverPhone: new FormControl(''),
    receiverAddress: new FormControl(''),
    receiverEmail: new FormControl(''),
    currentLocation: new FormControl(''),
    type: new FormControl(''),
    description: new FormControl(''),
    weight: new FormControl(''),
    trackingId: new FormControl(''),
  })

  constructor(
    private router: Router,
    private api: ApiService,
    private alertCtrl: AlertController,
  ) { }


  ngOnInit() {
    
  }

  addTracking() {
    if(this.editing) return;

    this.editing = true;
    
    this.api.addTracking(this.formGroup.value)
    .then((res) => {
      this.errText = "";
      this.router.navigateByUrl("dashboard");
      this.formGroup.reset();
      
    }, (err) => {
      if(err?.status == 401) {
        this.api.logout();
       this.formGroup.reset();
      }
      else{
        this.showErrAlert(err?.error.status)
      }
    })
    .finally(() => {
      this.editing = false;
    })
  }

  async showErrAlert(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      buttons: [
        { text: "OK", role: "cancel" }
      ]
    });

    await alert.present();
  }

}
