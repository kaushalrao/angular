import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { NotificationService } from '../../_services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Login } from '../../_models/Login';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../_models/User';
import { AuthService } from '../auth-service.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  userLogin: Login = new Login();
  existingUserLogin: Login = new Login();
  userInfo: User = new User();
  existingUserInfo: User = new User();
  submitted = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private notifyService: NotificationService,
    private cookieService: CookieService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    if (this.cookieService.get('auth-token')) {
      this.existingUserInfo = JSON.parse(this.cookieService.get('user-data'));
      this.existingUserLogin.username = this.existingUserInfo.username;
      this.existingUserLogin.password = this.existingUserInfo.password;
      this.authenticationService.login(this.existingUserLogin)
        .pipe(first())
        .subscribe(
          data => {
            this.userInfo = data;
            if (this.userInfo.auth_token !== this.cookieService.get('auth-token')) {
              this.cookieService.removeAll();
              this.authService.authenticated$.next(false);
            }
            else {
              this.router.navigate(['/dashboard'], { relativeTo: this.activatedRoute });
              this.notifyService.showSuccess("logged in Successfully !", "hey " + this.existingUserLogin.username);
            }
          },
          error => {
            this.notifyService.showError("Token Expired !", "hey " + this.existingUserLogin.username);
          });
    }
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.userLogin.username = this.f.username.value;
    this.userLogin.password = this.f.password.value;
    this.authenticationService.login(this.userLogin)
      .pipe(first())
      .subscribe(
        data => {
          this.userInfo = data;
          this.userInfo.password = this.f.password.value;
          this.cookieService.put('user-data', JSON.stringify(this.userInfo));
          this.cookieService.put('auth-token', this.userInfo.auth_token);
          this.cookieService.put('service-number', this.userInfo.service_number);
          this.router.navigate(['/dashboard'], { relativeTo: this.activatedRoute });
          this.notifyService.showSuccess("logged in Successfully !", "hey " + this.userLogin.username);
        })
  }

}
