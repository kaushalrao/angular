import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { NotificationService } from '../../_services/notification.service';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../auth-service.service';
import { first, catchError, retry } from 'rxjs/operators';
import { PasswordChange } from '../../_models/PasswordChange';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  passwordResetForm: FormGroup;
  info: PasswordChange = new PasswordChange();
  submitted = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    public notifyService: NotificationService,
    private cookieService: CookieService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.passwordResetForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }
  get f() { return this.passwordResetForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.passwordResetForm.invalid) {
      return;
    }
    this.info.current_password = this.f.currentPassword.value;
    this.info.new_password = this.f.newPassword.value;
    this.authenticationService.changePassword(this.info)
      .pipe(first())
      .subscribe(
        data => {
          this.cookieService.removeAll();
          this.authService.authenticated$.next(false);
          this.router.navigate(['\login']);
        })
      ;
  }
}
