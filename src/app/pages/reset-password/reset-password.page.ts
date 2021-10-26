import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { requiredField } from 'src/app/helpers/input-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  formGroup = new FormGroup({
    oldPassword: new FormControl('', [ requiredField, Validators.required ]),
    newPassword: new FormControl('', [ requiredField, Validators.required ]),
  });

  oldPasswordVisible = false;
  newPasswordVisible = false;
  isResetting = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.api.sessionsLogin()
    .then(() => {
    }, (reason: any) => {
      if(reason?.error.statuscode == 401) {
        this.api.logout();
      }
        
    })
    
  }

  resetPassword() {
    if(this.isResetting || this.formGroup.invalid) return;

    this.isResetting = true;

    this.api.resetPassword({ 
      oldPassword: this.formGroup.get('oldPassword').value?.trim(),
      newPassword: this.formGroup.get('newPassword').value?.trim(),
    })
    .then((res: any) => {
      this.api.saveCredentials({ id: res?.data.adminId, token: res?.data?.token });

      this.router.navigateByUrl('/dashboard');
    }, (reason: any) => {
      if(reason?.error.statuscode == 401) {
        this.api.logout();
      }
      else {
        this.showErrAlert(reason?.error?.status);
      }
    })
    .finally(() => {
      this.isResetting = false;
      this.formGroup.reset();
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
