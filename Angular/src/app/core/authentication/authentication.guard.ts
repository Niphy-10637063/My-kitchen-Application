import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard  {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
        this.router.navigate([`sign-in`]);
        return false;
      }   

    return true;
  }

}



