import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Storage } from "@capacitor/storage";
import { ID_KEY, TOKEN_KEY } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginGuard implements CanLoad {
  
  constructor(
    private router: Router,
  ) {}

  async canLoad(): Promise<boolean>{

    const idValue = await Storage.get({ key: ID_KEY });
    const tokenValue = await Storage.get({ key: TOKEN_KEY });

    if(idValue.value?.length > 0 || tokenValue.value?.length > 0)
      this.router.navigateByUrl("home", { replaceUrl: true });
    else {
      return true;
    }
  }
}
