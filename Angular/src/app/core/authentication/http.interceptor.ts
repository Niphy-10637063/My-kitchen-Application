import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  timeout,
  catchError,
  TimeoutError,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';
import * as HttpStatusCode from 'http-status-codes';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class HttpsRequestResponseInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router,private dialog:MatDialog) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const requestTimeout: number = Number(req.headers.get('timeout'));
    req = req.clone({ headers: req.headers.delete('timeout') });

    return next.handle(this.performRequest(req)).pipe(
      timeout(requestTimeout),
      catchError((err: HttpErrorResponse) => this.handleErrorResponse(err, req))
    );
  }

  private performRequest(req: HttpRequest<any>): HttpRequest<any> {
    const storedBearerToken: string | null =
      this.authService.getTokenFromStorage();
    if (storedBearerToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${storedBearerToken}`,
        },
      });
    }

    return req;
  }

  private handleErrorResponse(
    errorResponse: Error,
    req: HttpRequest<any>
  ): Observable<HttpEvent<any>> {
    if (errorResponse instanceof TimeoutError) {
    } else {
      if (
        errorResponse instanceof HttpErrorResponse &&
        (errorResponse.status === HttpStatusCode.StatusCodes.UNAUTHORIZED ||
          errorResponse.status === HttpStatusCode.StatusCodes.UNPROCESSABLE_ENTITY )
      ) {
        this.authService.logout();
        this.dialog.closeAll();
        this.router.navigate(['sign-in']);
      }
    }

    return throwError(errorResponse);
  }
}
