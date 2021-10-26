import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from "@capacitor/storage";
import { ApiService, ID_KEY, DEVICE_ID } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.page.html',
  styleUrls: ['./manage-admin.page.scss'],
})
export class ManageAdminPage implements OnInit {

  admins = [];
  myAdmin: any = {};
  isDeleteing = false;
  deviceId  = "";
  loaderId = "LOADER_ID";


  public displayColumns: string[] = ['position', 'device', 'loggedin', 'logout'];
  public deviceDataSource = new MatTableDataSource<IDevice>([]);

  constructor(
    private alertCtrl: AlertController,
    private api: ApiService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.api.sessionsLogin()
    .then(() => {
      this.getMyAdmin();
    }, (reason: any) => {
      if(reason?.error.statuscode == 401) {
        this.api.logout();
      }
    });
    
  }

  getAdmins() {
    this.api.viewAdmins({
      returntype: "0"
    })
    .then((res) => {
    }, (err) => {
      if(err?.error.stauscode == 401) {
        this.api.logout();
      }
      else {
        this.showErrAlert(err?.error.status);
      }
    });
  }
  
  async getMyAdmin() {
    const idValue = await Storage.get({ key: ID_KEY });
    this.deviceId = (await Storage.get({ key: DEVICE_ID })).value;
    this.api.viewAdmins({
      updatetype: "2",
      adminid: idValue.value,
      returntype: "0",
    })
    .then((res: any) => {

      this.myAdmin = res?.data[0];
      const devices: IDevice[] = [];
      this.myAdmin?.devices.forEach((device: any, i) => {
        devices.push({
          position: i + 1,
          id: device.id,
          model: device.model,
          loggedIn: device.loggedIn,
          uuid: device.uuid,
        })
      });

      this.deviceDataSource = new MatTableDataSource(devices);

      this.getAdmins();
    }, (err) => {
      if(err?.error.stauscode == 401) {
        this.api.logout();
      }
      else {
        this.showErrAlert(err?.error.status);
      }
    });
  }

  async logOutDevice(id: string) {

    const alert = await this.alertCtrl.create({
      message: "Log device out?",
      buttons: [
        { text: "Cancel", role: "cancel" },
        {
          text: "OK",
          handler: async () => {
            await this.showLoader();

            this.api.logOutDevice({ deviceId: id })
            .then((res) => {
              this.getMyAdmin();
            }, (err) => {
              if(err?.error.stauscode == 401) {
                this.api.logout();
              }
              else {
                this.showErrAlert(err?.error.status);
              }
            })
            .finally(() => {
              this.dismissLoader();
            });
          }
        }
      ]
    });

    alert.present();
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

  async showLoader() {
    const loading = await this.loadingCtrl.create({
      spinner: "bubbles",
      message: "Please wait...",
      id: this.loaderId
    });

    await loading.present();
  }

  dismissLoader() {
    this.loadingCtrl.dismiss();
  }

}

interface IDevice{
  position: string,
  id: string,
  model?: string,
  uuid?: string,
  loggedIn?: boolean,
}