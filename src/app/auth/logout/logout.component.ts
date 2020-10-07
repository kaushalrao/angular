import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../_services/notification.service';
import { first } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../auth-service.service';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {


  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private notifyService: NotificationService,
    private cookieService: CookieService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.logout();
  }

  logout() {
    this.authenticationService.logout(this.cookieService.get('auth-token'))
      .pipe(first())
      .subscribe(
        data => {
          this.cookieService.removeAll();
          this.authService.authenticated$.next(false);
          this.router.navigate(['\login']);
        });
  }


}
