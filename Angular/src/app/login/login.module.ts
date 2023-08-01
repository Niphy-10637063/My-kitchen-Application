import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';

@NgModule({
  declarations: [LoginComponent, SignUpComponent, SignInComponent, ForgotPasswordComponent, ResetPasswordComponent, OtpVerificationComponent],
  imports: [CommonModule, FormsModule, LoginRoutingModule],
  providers:[DatePipe]
})
export class LoginModule {}
