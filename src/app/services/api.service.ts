import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@capacitor/storage';
import { Device } from '@capacitor/device';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export const ID_KEY = 'ID';
export const TOKEN_KEY = 'TOKEN';
export const DEVICE_ID = 'UUID';

let HOST = environment.apiBaseUrl;

const loginApiRoute = `${HOST}/api/auth/login.ashx`;
const sessionsLoginApiRoute = `${HOST}/api/auth/sessionslogin.ashx`;
const logOutDeviceApiRoute = `${HOST}/api/auth/logoutdevice.ashx`;
const deleteDeviceApiRoute = `${HOST}/api/auth/deletedevice.ashx`;
const addAdminApiRoute = `${HOST}/api/auth/addadmin.ashx`;
const resetPasswordApiRoute = `${HOST}/api/auth/resetpassword.ashx`;
const viewAdminsApiRoute = `${HOST}/api/view/viewadmins.ashx`;
const viewTrackingApiRoute = `${HOST}/api/view/viewtracking.ashx`;
const viewTrackingActivityApiRoute = `${HOST}/api/view/viewactivity.ashx`;
const deleteTrackingApiRoute = `${HOST}/api/delete/deletetracking.ashx`;
const deleteTrackingActivityApiRoute = `${HOST}/api/delete/deleteactivity.ashx`;
const updateTrackingApiRoute = `${HOST}/api/update/tracking/updateall.ashx`;
const updateTrackingActivityApiRoute = `${HOST}/api/update/activity/updateall.ashx`;
const addTrackingApiRoute = `${HOST}/api/add/addtracking.ashx`;
const addTrackingActivityApiRoute = `${HOST}/api/add/addactivity.ashx`;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  httpHeaders: HttpHeaders = new HttpHeaders();

  private deliveryStatusOptions: IDeliveryStatusOption[] = [
    { text: 'Pending', value: '0', color: 'medium' },
    { text: 'On Delivery', value: '1', color: 'primary' },
    { text: 'On Transit', value: '2', color: 'warning' },
    { text: 'On Hold', value: '3', color: 'danger' },
    { text: 'Arrived', value: '4', color: 'success' },
  ];

  constructor(private http: HttpClient, private router: Router) {}

  async login(body: {
    username: string;
    password: string;
    deviceId?: string;
    deviceModel?: string;
  }) {
    return this.http.post(loginApiRoute, JSON.stringify(body)).toPromise();
  }

  async resetPassword(body: { oldPassword: string; newPassword?: string }) {
    return this.http
      .post(resetPasswordApiRoute, JSON.stringify(body), {
        headers: await this.getHeaders(),
      })
      .toPromise();
  }

  async addAdmin(body: { username: string; password?: string }) {
    return this.http
      .post(addAdminApiRoute, JSON.stringify(body), {
        headers: await this.getHeaders(),
      })
      .toPromise();
  }

  async sessionsLogin() {
    return this.http
      .get(sessionsLoginApiRoute, { headers: await this.getHeaders() })
      .toPromise();
  }

  async logOutDevice(body: { deviceId: string }) {
    return this.http
      .post(logOutDeviceApiRoute, JSON.stringify(body), {
        headers: await this.getHeaders(),
      })
      .toPromise();
  }

  async deleteDevice(body: { deviceId: string }) {
    return this.http
      .post(deleteDeviceApiRoute, JSON.stringify(body), {
        headers: await this.getHeaders(),
      })
      .toPromise();
  }

  async deleteTracking(body: { trackingId: string }) {
    return this.http
      .post(deleteTrackingApiRoute, JSON.stringify(body), {
        headers: await this.getHeaders(),
      })
      .toPromise();
  }

  async deleteTrackingActivity(body: { trackingActivityId: string }) {
    return this.http
      .post(deleteTrackingActivityApiRoute, JSON.stringify(body), {
        headers: await this.getHeaders(),
      })
      .toPromise();
  }

  async viewAdmins(params: {
    updatetype?: string;
    adminid?: string;
    search?: string;
    sortid?: string;
    order?: string;
    returntype?: string;
    page?: number;
    perpage?: number;
    qstring?: string;
    qstringb?: string;
    qstringc?: string;
  }) {
    await this.getHeaders();

    return this.http
      .get(viewAdminsApiRoute, { params, headers: await this.getHeaders() })
      .toPromise();
  }

  async viewTracking(params: {
    updatetype?: string;
    trackingcode?: string;
    search?: string;
    sortid?: string;
    order?: string;
    returntype?: string;
    page?: number;
    perpage?: number;
    qstring?: string;
    qstringb?: string;
    qstringc?: string;
  }) {
    await this.getHeaders();

    return this.http.get(viewTrackingApiRoute, { params }).toPromise();
  }

  async viewTrackingActivity(params: {
    updatetype?: string;
    trackingcode?: string;
    search?: string;
    sortid?: string;
    order?: string;
    returntype?: string;
    page?: number;
    perpage?: number;
    qstring?: string;
    qstringb?: string;
    qstringc?: string;
  }) {
    return this.http.get(viewTrackingActivityApiRoute, { params }).toPromise();
  }

  async updateTracking(
    body:
      | {
          trackingId?: string;
          trackingCode?: string;
          shippingDate?: string;
          deliveryDate?: string;
          shipVia?: string;
          origin?: string;
          destination?: string;
          currentLocation?: string;
          senderName?: string;
          senderPhone?: string;
          senderAddress?: string;
          senderEmail?: string;
          receiverName?: string;
          receiverPhone?: string;
          receiverAddress?: string;
          receiverEmail?: string;
          type?: string;
          description?: string;
          weight?: string;
          deliveryFees?: number;
          deliveryStatus?: number;
        }
      | any
  ) {
    return this.http
      .post(updateTrackingApiRoute, JSON.stringify(body), {
        headers: await this.getHeaders(),
      })
      .toPromise();
  }

  async updateTrackingActivity(
    body:
      | {
          trackingActivityId?: string;
          description?: string;
          location?: string;
          awaitingLocation?: string;
        }
      | any
  ) {
    return this.http
      .post(updateTrackingActivityApiRoute, JSON.stringify(body), {
        headers: await this.getHeaders(),
      })
      .toPromise();
  }

  async addTrackingActivity(
    body:
      | {
          trackingId?: string;
          description?: string;
          location?: string;
          awaitingLocation?: string;
          presentDate?: string;
        }
      | any
  ) {
    return this.http
      .post(addTrackingActivityApiRoute, JSON.stringify(body), {
        headers: await this.getHeaders(),
      })
      .toPromise();
  }

  async addTracking(
    body:
      | {
          trackingCode?: string;
          shippingDate?: string;
          deliveryDate?: string;
          hasDelivery?: boolean;
          pendingDelivery?: boolean;
          pendingShipping?: boolean;
          shipVia?: string;
          origin?: string;
          destination?: string;
          currentLocation?: string;
          senderName?: string;
          senderPhone?: string;
          senderAddress?: string;
          senderEmail?: string;
          receiverName?: string;
          receiverPhone?: string;
          receiverAddress?: string;
          receiverEmail?: string;
          type?: string;
          description?: string;
          weight?: string;
          deliveryFees?: number;
        }
      | any
  ) {
    return this.http
      .post(addTrackingApiRoute, JSON.stringify(body), {
        headers: await this.getHeaders(),
      })
      .toPromise();
  }

  async logout() {
    Storage.clear();
    this.router.navigateByUrl('login');
  }

  async saveCredentials(credentials: { id: string; token: string }) {
    await Storage.set({
      key: ID_KEY,
      value: credentials.id,
    });
    await Storage.set({
      key: TOKEN_KEY,
      value: credentials.token,
    });
  }

  private async getHeaders() {
    const { value } = await Storage.get({ key: DEVICE_ID });
    if (!value || value?.trim() == '') {
      const deviceId = (await Device.getId()).uuid;
      await Storage.set({
        key: DEVICE_ID,
        value: deviceId,
      });
    }

    this.httpHeaders = new HttpHeaders({
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      id: (await Storage.get({ key: ID_KEY })).value ?? '',
      token: (await Storage.get({ key: TOKEN_KEY })).value ?? '',
      uuid: (await Storage.get({ key: DEVICE_ID })).value ?? '',
    });

    return this.httpHeaders;
  }

  getDeliveryStatus() {
    return [...this.deliveryStatusOptions];
  }
}

interface IDeliveryStatusOption {
  value: string;
  text?: string;
  color?: string;
}
