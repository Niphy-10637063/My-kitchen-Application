import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  public password: string = '';
  public confirmPassword: string = '';
  constructor(private router: Router) {}
  onSubmit(): void {
  }
  redirect(): void {
    this.router.navigateByUrl('sign-in');
  }
}
