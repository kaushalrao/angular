import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {

  authenticated$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private cookieService: CookieService) { }

  public isAuthenticated(): boolean {
    var token = this.cookieService.get('auth-token');
    if (token) {
      this.authenticated$.next(true);
      return true;
    }
    else {
      this.authenticated$.next(false);
      return false;
    }
  }
}