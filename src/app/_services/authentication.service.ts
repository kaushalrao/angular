import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../_models/Login';
import { User } from '../_models/User';
import { PasswordChange } from '../_models/PasswordChange';
import { CookieService } from 'ngx-cookie';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient,
    private cookieService: CookieService) { }

  login(login: Login) {
    return this.http.post<User>('http://localhost:8000/users/api/auth/login', login, httpOptions);
  }

  register(user: User) {
    return this.http.post<User>('http://localhost:8000/users/api/auth/register', user, httpOptions);
  }

  logout(token: string) {
    return this.http.post('http://localhost:8000/users/api/auth/logout', null, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + token)
    });
  }

  changePassword(info : PasswordChange) {
    return this.http.post<any>('http://localhost:8000/users/api/auth/password_change', info, {
      headers: new HttpHeaders().set('Authorization', 'Token ' + this.cookieService.get('auth-token'))
    });
  }
}
