import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  loadingTrack = true;
  cards: any[] = [];
  numOfItems = 1;
  pageSize = 30;
  page = 1;
  length = 0;

  constructor(
    private router: Router,
    private api: ApiService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getTrackRecords();
  }

  pageEvent(e) {
    this.page = e?.pageIndex + 1;
    this.pageSize = e?.pageSize;
    this.getTrackRecords();
  }

  reset() {
    this.page = 1;
    this.pageSize = 30;
  }

  getDate(value) {
    const offset = new Date().getTimezoneOffset();
    const date = new Date(new Date(value).getTime() + (-offset * 60 * 1000));
    return date.toLocaleDateString();
  }

  getTrackRecords() {
    this.api.viewTracking({ page: this.page, perpage: this.pageSize, })
    .then((res: any) => {
      this.cards = [];
      res?.data.forEach((card: any) => {
        this.cards.push({
          ...card, 
          statusColor: this.getDeliveryOption(card?.deliveryStatus)?.color,
          statusText: this.getDeliveryOption(card?.deliveryStatus)?.text,
        });
      });

      this.length = this.cards[0]?.totalRows;

      if(res == null)
        this.noRecordAlert();
    }, (err) => {
      if(err?.status == 401) {
        this.api.logout();
      }
    })
    .finally(() => {
      this.loadingTrack = false;
    });
  }

  logout() {
    this.api.logout();
  }


  async deleteRecord(id: string) {
    const alert = await this.alertCtrl.create({
      message: "Delete record?",
      buttons: [
        { text: "Cancel", role: "cancel" },
        { text: "OK", handler: async () => {

          await this.showLoader();

          this.api.deleteTracking({ trackingId: id })
          .then(() => {
            this.reset();
            this.getTrackRecords();
          })
          .finally(async () => {
            this.dismissLoader();            
            alert.dismiss();
          })
        } 
      }]
    });

    alert.present();
  }

  getDeliveryOption(id: string) {
    const option = this.api.getDeliveryStatus().find(option => option?.value == id);
    return option;
  }

  async noRecordAlert(){
    const alert = await this.alertCtrl.create({
      message: "No records",
      buttons: [
        { text: "OK", role: "cancel" }
      ]
    });

    await alert.present();
  }

  async showLoader() {
    const loading = await this.loadingCtrl.create({
      spinner: "bubbles",
      message: "Please wait...",
    });

    await loading.present();
  }

  dismissLoader() {
    this.loadingCtrl.dismiss();
  }


}
