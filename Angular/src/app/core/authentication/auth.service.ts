import { Injectable } from '@angular/core';
import { HttpService } from '../common-services/http.service';
import { DataService } from '../common-services/data.service';
import { Strings } from '../invariables/strings';
import { tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpService: HttpService, private data: DataService) {}

  public login(userCredentials: any): any {
    return this.httpService.post<any>(
      `${this.data.baseUrl}/${Strings.API_ENDPOINT_LOGIN}`,
      userCredentials,
      60000
    );
  }

  public verifyOtp(body: any): any {
    return this.httpService.post<any>(
      `${this.data.baseUrl}/${Strings.API_ENDPOINT_VERIFY_OTP}`,
      body,
      60000
    );
  }
  public resendOtp(body: any): any {
    return this.httpService.post<any>(
      `${this.data.baseUrl}/${Strings.API_ENDPOINT_RESEND_OTP}`,
      body,
      60000
    );
  }
  public refreshToken(): any {
    return this.httpService.get<any>(
      `${this.data.baseUrl}/${Strings.API_ENDPOINT_REFRESH}`,
      60000
    );
  }

  public getUserInfoByEmail(email: string): any {
    return this.httpService.get<any>(
      `${this.data.baseUrl}/${Strings.API_ENDPOINT_USERINFO_BY_EMAIL}` + email,
      60000
    );
  }

  public register(data: any): any {
    return this.httpService.post<any>(
      `${this.data.baseUrl}/${Strings.API_ENDPOINT_REGISTER}`,
      data,
      60000
    );
  }

  public logout(): void {
    this.destroySession();
  }

  private handleError(error: HttpErrorResponse): void {
    if (error.error instanceof ErrorEvent) {
      // this.logger.error(`An error occurred while trying to login: ${error.error.message}`, error.error);
    } else {
      // this.logger.error(`Login error: backend returned code ${error.status}. Body was: ${error.error}`, error.error);
    }
  }

  public isLoggedIn(): boolean {
    const token: string | null = this.getTokenFromStorage();
    if (!token) {
      return false;
    }
    return true;
  }

  public isAdmin(): boolean {
    const user: any = this.getUserFromStorage();
    if (user == undefined || user == '' || user == null || !user.isAdmin) {
      return false;
    }
    return true;
  }

  public setAccessToken(data: any): void {
    localStorage.setItem(
      Strings.ACCESS_TOKEN_STORAGE_VARIABLE_NAME,
      data.access
    );
  }
  public setRefreshToken(data: any): void {
    localStorage.setItem(
      Strings.REFRESH_TOKEN_STORAGE_VARIABLE_NAME,
      data.refresh
    );
  }

  public setSession(data: any): void {
    this.setAccessToken(data.data);
    this.setRefreshToken(data.data);

    const userDetails: any = {
      userId: data.data.userId,
      isAdmin: data.data.isAdmin,
      userName: data.data.username,
      email: data.data.email,
    };
    localStorage.setItem(Strings.SESSION_USER, JSON.stringify(userDetails));
  }

  public destroySession(): void {
    localStorage.removeItem(Strings.ACCESS_TOKEN_STORAGE_VARIABLE_NAME);
    localStorage.removeItem(Strings.REFRESH_TOKEN_STORAGE_VARIABLE_NAME);
    localStorage.removeItem(Strings.SESSION_USER);
  }

  public getTokenFromStorage(): string | null {
    return localStorage.getItem(Strings.ACCESS_TOKEN_STORAGE_VARIABLE_NAME);
  }

  public getUserFromStorage(): any {
    const sessionUser: string | null = localStorage.getItem(
      Strings.SESSION_USER
    );
    if (sessionUser !== null) {
      return JSON.parse(sessionUser);
    }
    return null;
  }
}
