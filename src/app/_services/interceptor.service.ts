import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(public notifyService: NotificationService) { }
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(tap(evt => {
        if (evt instanceof HttpResponse) {
          if (evt.body && evt.body.success)
            this.notifyService.showSuccess(evt.body.success, evt.body.success.title);
        }
      }),
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse) {
            try {
              this.notifyService.showError(err.error.status, '');
            } catch (e) {
              this.notifyService.showError('An error occurred', '');
            }
          }
          return of(err);
        }))
  };
}