import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {
  formControl = new FormControl('');

  id = '';
  hasTracking = false;
  loadingTracking = false;
  errText = '';
  details: any = {};

  public displayColumns: string[] = [
    'position',
    'presentDate',
    'activity',
    'location',
    'awaitingLocation',
  ];
  public activityDataSource = new MatTableDataSource<any>([]);
  deliveryStatusOptions: any[] = [];

  formGroup = new FormGroup({
    origin: new FormControl(''),
    destination: new FormControl(''),
    shipVia: new FormControl(''),
    deliveryFees: new FormControl(''),
    shippingDate: new FormControl(''),
    deliveryDate: new FormControl(''),
    hasDelivery: new FormControl(''),
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

  pageSize = 20;
  page = 1;
  activityLength = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      if (this.id) {
        this.getTracking(this.id);
        this.formControl.setValue(this.id);
        this.loadingTracking = true;
      }
    });

    this.api.getDeliveryStatus().forEach((option) => {
      this.deliveryStatusOptions.push(option);
    });
  }

  search() {
    if (this.formControl.value?.trim() == '') return;

    this.loadingTracking = true;
    this.getTracking(this.formControl.value?.trim(), true);
  }

  getTracking(code: string, search?: boolean) {
    this.api
      .viewTracking({ updatetype: '2', trackingcode: code })
      .then(
        (res: any) => {
          this.hasTracking = res?.statuscode == 200;
          if (this.hasTracking) {
            this.details = {
              ...res?.data[0],
              statusText: this.getDeliveryOption(res?.data[0]?.deliveryStatus)
                .text,
            };

            if (search)
              this.router.navigateByUrl(
                `/tracker/${res?.data[0].trackingCode}`
              );

            this.getTrackActivityRecords();
          } else {
            this.noRecordAlert();
          }
        },
        (err) => {
          this.noRecordAlert(err.statusText);
        }
      )
      .finally(() => {
        this.loadingTracking = false;
      });
  }

  getTrackActivityRecords() {
    this.api
      .viewTrackingActivity({
        updatetype: '1',
        trackingcode: this.id,
        page: this.page,
        perpage: this.pageSize,
      })
      .then(
        (res: any) => {
          const activities: IActivity[] = [];
          res?.data?.forEach((activity: any, i) => {
            activities.push({
              position: i + 1,
              awaitingLocation: activity.awaitingLocation,
              description: activity.description,
              location: activity.location,
              presentDate: this.getDate(activity.presentDate),
              trackingActivityId: activity.trackingActivityId,
              trackingCode: activity.trackingCode,
            });

            this.activityLength = res?.data[0]?.totalRows;
          });
          this.activityDataSource = new MatTableDataSource(activities);
        },
        (err) => {
          if (err?.error.statuscode == 401) {
            this.api.logout();
          }
        }
      )
      .finally(() => {});
  }

  pageEvent(e) {
    this.page = e?.pageIndex + 1;
    this.pageSize = e?.pageSize;
    this.getTrackActivityRecords();
  }

  reset() {
    this.page = 1;
    this.pageSize = 30;
  }

  getDate(value: string) {
    if (!value || value.toString()?.trim() == '') return '';
    const offset = new Date().getTimezoneOffset();
    const date = new Date(new Date(value).getTime() + -offset * 60 * 1000);
    return date.toLocaleString();
  }

  getDeliveryOption(id: string) {
    const option = this.api
      .getDeliveryStatus()
      .find((option) => option?.value == id);
    return option;
  }

  async noRecordAlert(message?: string) {
    const alert = await this.alertCtrl.create({
      message: message || 'No records',
      buttons: [{ text: 'OK', role: 'cancel' }],
    });

    await alert.present();
  }

  setFormGroup() {
    this.formGroup.get('origin').setValue(this.details?.origin);
    this.formGroup.get('destination').setValue(this.details?.destination);
    this.formGroup.get('shipVia').setValue(this.details?.shipVia);
    this.formGroup.get('deliveryFees').setValue(this.details?.deliveryFees);
    this.formGroup.get('shippingDate').setValue(this.details?.shippingDate);
    this.formGroup.get('deliveryDate').setValue(this.details?.deliveryDate);
    this.formGroup.get('hasDelivery').setValue(this.details?.hasDelivery);
    this.formGroup.get('senderName').setValue(this.details?.senderName);
    this.formGroup.get('senderPhone').setValue(this.details?.senderPhone);
    this.formGroup.get('senderAddress').setValue(this.details?.senderAddress);
    this.formGroup.get('senderEmail').setValue(this.details?.senderEmail);
    this.formGroup.get('receiverName').setValue(this.details?.receiverName);
    this.formGroup.get('receiverPhone').setValue(this.details?.receiverPhone);
    this.formGroup
      .get('receiverAddress')
      .setValue(this.details?.receiverAddress);
    this.formGroup.get('receiverEmail').setValue(this.details?.receiverEmail);
    this.formGroup
      .get('currentLocation')
      .setValue(this.details?.currentLocation);
    this.formGroup.get('type').setValue(this.details?.type);
    this.formGroup.get('description').setValue(this.details?.description);
    this.formGroup.get('weight').setValue(this.details?.weight);
    this.formGroup.get('trackingId').setValue(this.details?.trackingId);
  }

  ionViewWillEnter() {
    const translate = document.getElementById('google_translate_element');
    translate.style.visibility = 'visible';
  }

  ionViewWillLeave() {
    const translate = document.getElementById('google_translate_element');
    translate.style.visibility = 'hidden';
  }

}

interface IActivity {
  awaitingLocation?: string;
  dateCreated?: string;
  dateModified?: string;
  description?: string;
  location?: string;
  presentDate?: string;
  trackingActivityId?: string;
  trackingCode?: string;
  position?: number;
}
