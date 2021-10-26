import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { requiredField } from 'src/app/helpers/input-validators';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
})
export class AddAdminComponent implements OnInit {

  formGroup = new FormGroup({
    username: new FormControl('', [ requiredField, Validators.required ]),
    password: new FormControl('', [ requiredField, Validators.required ]),
  });

  passwordVisible = false;
  isAdding = false;

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
    if(this.isAdding || this.formGroup.invalid) return;

    this.isAdding = true;

    this.api.addAdmin({ 
      username: this.formGroup.get('username').value?.trim(),
      password: this.formGroup.get('password').value?.trim(),
    })
    .then((res: any) => {
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
      this.isAdding = false;
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
