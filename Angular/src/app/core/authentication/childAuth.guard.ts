import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class ChildAuthGuard {
  constructor(private auth: AuthService,
     private router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.auth.isAdmin()) {
        this.router.navigate([`unauthorized-access-401`]);
      return false;
    }
    // Logic to determine if the child route can be activated
    // You can perform any checks, authentication, or authorization logic here
    // Return true if the child route can be activated, or false/UrlTree to deny access
    return true;
  }
}
