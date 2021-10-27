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
    
    this.api.addTracking({...this.formGroup.value,
      deliveryDate: new Date(this.formGroup.get('deliveryDate').value).toISOString(),
      shippingDate: new Date(this.formGroup.get('shippingDate').value).toISOString(),})
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

  //#region Date manipulation

  deliveryTime;
  deliveryDate;
  
  shippingTime;
  shippingDate;

  dateChange(e, option: InputDateOptions) {
    if(option == "deliveryDate") {
      this.deliveryDate = e.value;
      this.getDeliveryFullDate(this.deliveryDate, this.deliveryTime, option);
    }
    else if(option == "shippingDate") {
      this.shippingDate = e.value;
      this.getDeliveryFullDate(this.shippingDate, this.shippingTime, option);
    }

  }
  
  timeChange(e, option: InputDateOptions) {
    if(option == "deliveryDate") {
      this.deliveryTime = e.detail.value;
      this.getDeliveryFullDate(this.deliveryDate, this.deliveryTime, option);
    }
    else if(option == "shippingDate") {
      this.shippingTime = e.detail.value;
      this.getDeliveryFullDate(this.shippingDate, this.shippingTime, option);
    }
  }
  
  getOffsetDate(value) {
    const offset = new Date().getTimezoneOffset();
    const date = new Date(new Date(value).getTime() - (offset * 60 * 1000));

    return date;
  }

  getDeliveryFullDate(date: string, time: string, input: InputDateOptions) {
    var timeObj = new Date(time);
    var timeString = this.isNullOrWhitespace(date) || this.isNullOrWhitespace(time) ? "" : timeObj.getHours() + ':' + timeObj.getMinutes() + ':00';
    var dateObj = new Date(this.getDate(date) + ' ' + timeString);
    
    const dateString = this.isNullOrWhitespace(date) ? "" : dateObj.toLocaleString();

    this.formGroup.get(input).setValue(dateString);

    return dateObj;
  }

  getDate(value) {
    if(this.isNullOrWhitespace(value)) return "";
    const date = new Date(value);
    return date.toDateString();
  }



  //#endregion

  async showErrAlert(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      buttons: [
        { text: "OK", role: "cancel" }
      ]
    });

    await alert.present();
  }

  isNullOrWhitespace(value: string) {
    return !value || value.toString()?.trim() == "";
  }
}

type InputDateOptions = "deliveryDate" | "shippingDate";