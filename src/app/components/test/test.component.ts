import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  template: `
    <div>
      <input
        id="username-input"
        type="text"
        [value]="username"
        (input)="updateInput($event, 0)"
        placeholder="Username"
      />
      <br />
      <input
        id="password-input"
        type="password"
        [value]="password"
        (input)="updateInput($event, 1)"
        placeholder="Password"
      />
      <br />

      <button
        id="login-button"
        type="submit"
        (click)="onLogin()"
        [disabled]="hasError"
      >
        Submit
      </button>
    </div>
  `,
})
export class LoginPageComponent implements OnInit {
  @Output() login = new EventEmitter<any>();
  username = '';
  password = '';

  get hasError() {
    return this.username == '' || this.password == '';
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.http
    //   .post(
    //     'https://stagingapi.idashyou.ng/api/v1/messages/send-email.ashx',
    //     {}
    //   )
    //   .subscribe(
    //     (data) => {
    //       console.log(data);
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
  }

  updateInput(e: any, type: number) {
    if (type == 0) {
      this.username = e.target.value;
    } else {
      this.password = e.target.value;
    }
  }

  onLogin() {
    this.login.emit({ username: this.username, password: this.password });
  }
}
