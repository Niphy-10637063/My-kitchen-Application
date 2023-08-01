import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  otp_number: any = '';
  email: string = '';
  minutes: number = 0;
  seconds: number = 0;
  private routeSub: Subscription | undefined;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      if (params && params['email']) {
        this.email = params['email'];
        this.getUserInfo();
      }
    });
  }
  getUserInfo(): void {
    this.authService.getUserInfoByEmail(this.email).subscribe(
      (res: any) => {
        if (res && res.body && res.body.data) {
          if (res.body.data.expiration_time) {
            const expiry: any =
              new Date(res.body.data.expiration_time).getTime() - 3600000;
            const current: any = new Date().getTime();
            const diff = expiry - current;
            console.log(diff);
            if (diff > 0) {
              this.minutes = Math.floor(diff / 60000); // 1 minute = 60000 milliseconds
              this.seconds = Math.floor((diff % 60000) / 1000);
              this.startCounter();
            }
          }
        } else {
          this.openSnackBar('Something went wrong', true);
        }
      },
      (err: any) => {
        if (err && err.error && err.error.message) {
          this.openSnackBar(err.error.message, true);
        } else {
          this.openSnackBar('Something went wrong', true);
        }
      }
    );
  }

  startCounter(): void {
    const interval = setInterval(() => {
      if (this.minutes === 0 && this.seconds === 0) {
        clearInterval(interval);
        // Handle counter expiration here (e.g., show an error message)
      } else {
        // Decrement seconds and minutes
        if (this.seconds === 0) {
          this.minutes--;
          this.seconds = 59;
        } else {
          this.seconds--;
        }
      }
    }, 1000); // 1000 ms = 1 second
  }

  onSubmit(): void {
    this.authService
      .verifyOtp({ email: this.email, otp: +this.otp_number })
      .subscribe({
        next: (res: any) => {
          if (res && res.status == 200) {
            if (res.body && res.body.message) {
              this.openSnackBar(res.body.message, false);
              this.redirect();
            }
          } else {
            this.openSnackBar('Something went wrong', true);
          }
        },
        error: (err: any) => {
          if (err && err.error && err.error.message) {
            this.openSnackBar(err.error.message, true);
          } else {
            this.openSnackBar('Something went wrong', true);
          }
        },
      });
  }

  public openSnackBar(message: string, hasError: boolean): any {
    const config: any = new MatSnackBarConfig();
    config.panelClass = hasError ? ['error-red'] : ['success-green'];
    config.duration = 5000;
    config.verticalPosition = 'bottom';
    this.snackBar.open(message, undefined, config);
  }
  redirect(): void {
    this.router.navigateByUrl('sign-in');
  }

  resendOtp(otp: NgForm): void {
    this.authService.resendOtp({ email: this.email }).subscribe({
      next: (res: any) => {
        if (res && res.status == 200) {
          if (res.body && res.body.message) {
            this.openSnackBar(res.body.message, false);
            this.getUserInfo();
            otp.resetForm();
          }
        } else {
          this.openSnackBar('Something went wrong', true);
        }
      },
      error: (err: any) => {
        if (err && err.error && err.error.message) {
          this.openSnackBar(err.error.message, true);
        } else {
          this.openSnackBar('Something went wrong', true);
        }
      },
    });
  }
  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
