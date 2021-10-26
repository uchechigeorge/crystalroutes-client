import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService, ID_KEY, TOKEN_KEY } from '../services/api.service';
import { Storage } from "@capacitor/storage";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private router: Router,
  ) {}

  async canLoad(): Promise<boolean>{

    const idValue = await Storage.get({ key: ID_KEY });
    const tokenValue = await Storage.get({ key: TOKEN_KEY });

    if(idValue.value?.length > 0 || tokenValue.value?.length > 0)
      return true;
    else {
      this.router.navigateByUrl("tracker", { replaceUrl: true });
      return false;
    }

     
  }
}
