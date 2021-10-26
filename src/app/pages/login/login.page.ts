import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { requiredField } from 'src/app/helpers/input-validators';
import { ApiService, ID_KEY, TOKEN_KEY, DEVICE_ID } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from "@capacitor/storage";
import { Device } from "@capacitor/device";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public formGroup: FormGroup = new FormGroup({
      username: new FormControl('', [requiredField]),
      password: new FormControl('', [requiredField])
    }
  );

  passwordVisible = false;

  loggingIn = false;
  
  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.getDeviceInfo();
  }

  async login() {

    if(this.formGroup.invalid || this.loggingIn) return;
    this.loggingIn = true;

    const device = this.getDeviceInfo();

    this.apiService.login({ 
      password: this.formGroup.get('password').value?.trim(), 
      username: this.formGroup.get('username').value?.trim(),
      deviceId: (await device).deviceId.uuid,
      deviceModel: (await device).deviceInfo.model,
    })
    .then(async (res: any) => {
      await Storage.set({
        key: ID_KEY,
        value: res?.data.adminId
      });
      await Storage.set({
        key: TOKEN_KEY,
        value: res?.data.token
      });
      await Storage.set({
        key: DEVICE_ID,
        value: (await device).deviceId.uuid
      });
    
      this.router.navigateByUrl('home');
      
      this.formGroup.reset();
    }, async (err) => {
      this.formGroup.get('password').setValue('');
      const alert = await this.alertCtrl.create({
        message: err?.error.status,
        buttons: [
          {
            text: "Dismiss",
            role: "cancel"
          }
        ]
      });
      
      await alert.present();
    })
    .finally(() => {
      this.loggingIn = false;
    });
  }

  async getDeviceInfo() {
    const deviceId = await Device.getId();
    const deviceInfo = await Device.getInfo();

    return { deviceId, deviceInfo };
  }

}
