import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { requiredField } from 'src/app/helpers/input-validators';
import { MatTableDataSource } from '@angular/material/table';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-track',
  templateUrl: './edit-track.component.html',
  styleUrls: ['./edit-track.component.scss'],
})
export class EditTrackComponent implements OnInit {

  //#region Props

  id = "";
  trackingId = "";
  details: any = {};
  loadingTrack = true;

  editing = false;
  editingActivity = false;
  
  btnText = "Edit";
  btnTextActivity = "Add";
  
  errText = "";
  errTextActivity = "";

  deliveryStatusOptions: any[] = [];

  public displayColumns: string[] = ['position', 'presentDate', 'activity', 'location', 'awaitingLocation', 'action'];
  public activityDataSource = new MatTableDataSource<any>([]);

  formGroup = new FormGroup({
    origin: new FormControl('', [requiredField, Validators.required]),
    destination: new FormControl('', [requiredField, Validators.required]),
    shipVia: new FormControl('', [requiredField, Validators.required]),
    deliveryFees: new FormControl('', [requiredField, Validators.required]),
    shippingDate: new FormControl('',),
    deliveryDate: new FormControl('',),
    hasDelivery: new FormControl('',),
    deliveryStatus: new FormControl(''),
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
  });

  public activityForm = new FormGroup({
    location: new FormControl(''),
    awaitingLocation: new FormControl(''),
    description: new FormControl('', [requiredField, Validators.required]),
    presentDate: new FormControl(''),
  });

  deliveryStatusColor = "medium";
  deliveryStatusText = "Pending";
  pageSize = 20;
  page = 1;
  activityLength = 0;

  //#endregion

  constructor(
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });

    this.api.getDeliveryStatus().forEach(option => {
      this.deliveryStatusOptions.push(option);
    });

    this.getTrackRecords();
    this.getTrackActivityRecords();
  }

  ionViewWillEnter() {

  }

  //#region Api Calls

  getTrackRecords() {
    this.api.viewTracking({ updatetype: "2", trackingcode: this.id })
    .then((res: any) => {
      this.details = res?.data[0];
      this.setFormGroup();
      this.getDeliveryOption();
      this.trackingId = this.details?.trackingId;
    }, (err) => {
      if(err?.status == 401) {
        this.api.logout();
      }
    })
    .finally(() => {
      this.loadingTrack = false;
    });
  }
  
  getTrackActivityRecords() {
    this.api.viewTrackingActivity({ updatetype: "1", trackingcode: this.id, page: this.page, perpage: this.pageSize })
    .then((res: any) => {
      const activities: IActivity[] = [];
      res?.data?.forEach((activity: any, i: any) => {
        activities.push({ 
          position: i + 1,
          awaitingLocation: activity.awaitingLocation,
          description: activity.description,
          location: activity.location,
          presentDate: this.getOffsetDate(activity.presentDate).toLocaleString(),
          trackingActivityId: activity.trackingActivityId,
          trackingCode: activity.trackingCode,
        });

        this.activityLength = res?.data[0]?.totalRows;
      });
      this.activityDataSource = new MatTableDataSource(activities);
      
    }, (err) => {
      if(err?.error.statuscode == 401) {
        this.api.logout();
      }
    })
    .finally(() => {

    });
  }

  async deleteActivity(id: string) {
    const alert = await this.alertCtrl.create({
      message: "Delete activity?",
      buttons: [
        { text: "Cancel", role: "cancel" },
        { 
          text: "OK",
          handler: async () => {
            this.api.deleteTrackingActivity({ trackingActivityId: id })
            .then(() => {
              this.getTrackActivityRecords();
            }, (err) => {
              if(err?.error.statuscode == 401) {
                this.api.logout();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  updateTracking() {
    if(this.editing) return;

    this.editing = true;
    
    this.api.updateTracking({...this.formGroup.value, 
      deliveryDate: new Date(this.formGroup.get('deliveryDate').value).toISOString(),
      shippingDate: new Date(this.formGroup.get('shippingDate').value).toISOString(),
    })
    .then((res) => {
      this.errText = "";
      this.btnText = "Done";
      setTimeout(() => {
        this.btnText = "Edit";
      }, 3000);

      this.getTrackRecords();
    }, (err) => {
      if(err?.error.statuscode == 401) {
        this.api.logout();
      }
      else {
        this.showErrAlert(err?.error.status);
      }

    })
    .finally(() => {
      this.editing = false;
    })
  }
  
  addTrackingActivity() {
    if(this.editingActivity || this.activityForm.get('description').value?.trim() == "") return;

    this.editingActivity = true;
    
    const presentDate = this.activityForm.get('presentDate').value;

    this.api.addTrackingActivity({...this.activityForm.value,
      trackingId: this.trackingId,
      presentDate: this.isNullOrWhitespace(presentDate) ? "" :  new Date(presentDate)?.toISOString()
    })
    .then((res) => {
      this.errTextActivity = "";
      this.btnTextActivity = "Done";
      this.getTrackActivityRecords();
      this.activityForm.reset();
      this.activityForm.markAsUntouched();
      this.activityForm.markAsPristine();

      setTimeout(() => {
        this.btnTextActivity = "Add";
      }, 3000)

    }, (err) => {
      if(err?.error.statuscode == 401) {
        this.api.logout();
      }
      else {
        this.showErrAlert(err?.error.status);
      }
    })
    .finally(() => {
      this.editingActivity = false;
    })
  }

  //#endregion

  pageEvent(e) {
    this.page = e?.pageIndex + 1;
    this.pageSize = e?.pageSize;
    this.getTrackActivityRecords();
  }

  
  getDeliveryOption() {
    const option = this.deliveryStatusOptions.find(option => option?.value == this.details?.deliveryStatus);
    this.deliveryStatusColor = option?.color;
    this.deliveryStatusText = option?.text;
    return option;
  }

  reset() {
    this.page = 1;
    this.pageSize = 30;
  }

  //#region Date manipulation

  deliveryTime;
  deliveryDate;
  
  shippingTime;
  shippingDate;

  activityTime;
  activityDate;

  dateChange(e, option: InputDateOptions) {
    if(option == "deliveryDate") {
      this.deliveryDate = e.value;
      this.getDeliveryFullDate(this.deliveryDate, this.deliveryTime, option);
    }
    else if(option == "shippingDate") {
      this.shippingDate = e.value;
      this.getDeliveryFullDate(this.shippingDate, this.shippingTime, option);
    }
    else if(option == "activity") {
      this.activityDate = e.value;
      this.getDeliveryFullDate(this.activityDate, this.activityTime, option);
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
    else if(option == "activity") {
      this.activityTime = e.detail.value;
      this.getDeliveryFullDate(this.activityDate, this.activityTime, option);
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

    if(input == "activity") {
      this.activityForm.get('presentDate').setValue(dateString);
    }
    else {
      this.formGroup.get(input).setValue(dateString);
    }

    return dateObj;
  }

  getDate(value) {
    if(this.isNullOrWhitespace(value)) return "";
    const date = new Date(value);
    return date.toDateString();
  }

  // getTime(value) {
  //   if(this.isNullOrWhitespace(value)) return "";
  //   const time = new Date(value).toLocaleTimeString();
  //   return time;
  // }

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

  setFormGroup() {
    this.formGroup.get('origin').setValue(this.details?.origin);
    this.formGroup.get('destination').setValue(this.details?.destination);
    this.formGroup.get('shipVia').setValue(this.details?.shipVia);
    this.formGroup.get('deliveryFees').setValue(this.details?.deliveryFees);
    this.formGroup.get('deliveryStatus').setValue(this.details?.deliveryStatus);
    this.formGroup.get('senderName').setValue(this.details?.senderName);
    this.formGroup.get('senderPhone').setValue(this.details?.senderPhone);
    this.formGroup.get('senderAddress').setValue(this.details?.senderAddress);
    this.formGroup.get('senderEmail').setValue(this.details?.senderEmail);
    this.formGroup.get('receiverName').setValue(this.details?.receiverName);
    this.formGroup.get('receiverPhone').setValue(this.details?.receiverPhone);
    this.formGroup.get('receiverAddress').setValue(this.details?.receiverAddress);
    this.formGroup.get('receiverEmail').setValue(this.details?.receiverEmail);
    this.formGroup.get('currentLocation').setValue(this.details?.currentLocation);
    this.formGroup.get('type').setValue(this.details?.type);
    this.formGroup.get('description').setValue(this.details?.description);
    this.formGroup.get('weight').setValue(this.details?.weight);
    this.formGroup.get('trackingId').setValue(this.details?.trackingId);

    this.setDeliveryDate();
    this.setShippingDate();
  }

  setDeliveryDate() {
    const date: any = this.isNullOrWhitespace(this.details?.deliveryDate) ? "" : this.getOffsetDate(this.details?.deliveryDate).toLocaleString();
    this.formGroup.get('deliveryDate').setValue(date);
    this.deliveryTime = this.isNullOrWhitespace(this.details?.deliveryDate) ? "" : new Date(this.getOffsetDate(this.details?.deliveryDate)).toISOString();
    this.deliveryDate = this.isNullOrWhitespace(this.details?.deliveryDate) ? "" : new Date(this.getOffsetDate(this.details?.deliveryDate));
  }
  
  setShippingDate() {
    const date = this.isNullOrWhitespace(this.details?.shippingDate) ? "" : this.getOffsetDate(this.details?.shippingDate).toLocaleString();
    this.formGroup.get('shippingDate').setValue(date);
    this.shippingTime = this.isNullOrWhitespace(this.details?.shippingDate) ? "" : new Date(this.getOffsetDate(this.details?.shippingDate)).toISOString();
    this.shippingDate = this.isNullOrWhitespace(this.details?.shippingDate) ? "" : new Date(this.getOffsetDate(this.details?.shippingDate));;
  }

  isNullOrWhitespace(value: string) {
    return !value || value.toString()?.trim() == "";
  }
}

interface IActivity{
  awaitingLocation?: string,
  dateCreated?: string,
  dateModified?: string,
  description?: string,
  location?: string,
  presentDate?: string,
  trackingActivityId?: string,
  trackingCode?: string,
  position?: number,
}

type InputDateOptions = "deliveryDate" | "shippingDate" | "activity";