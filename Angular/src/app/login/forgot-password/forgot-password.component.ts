import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  public emailId: string = '';
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  reset: boolean = false;
  constructor(private router: Router) {}
  onSubmit(): void {
    this.reset = true;
  }
  redirect(): void {
    this.router.navigateByUrl('sign-in');
  }
}
