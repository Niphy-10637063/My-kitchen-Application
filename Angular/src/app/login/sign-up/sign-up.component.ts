import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { HttpService } from 'src/app/core/common-services/http.service';
declare var bootstrap: any;
declare var $: any;
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  public userName: string = '';
  public password: string = '';
  public confirmPassword: string = '';
  public emailId: string = '';
  public Name: string = '';
  public mobile: string = '';
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  phonePattern = '[789][0-9]{9}';
  submitted: boolean = false;
  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private http:HttpService
  ) {}
  ngOnInit(): void {
    const popoverTriggerList: any = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    var popoverList = [...popoverTriggerList].map(function (
      popoverTriggerEl: any
    ) {
      const popoverId = popoverTriggerEl.attributes['data-content-id'];
      if (popoverId) {
        console.log(popoverId);
        const contentEl = $(`#${popoverId.value}`).html();
        return new bootstrap.Popover(popoverTriggerEl, {
          content:
            '<ul><li>Password should contain at least one letter (uppercase or lowercase).<li>Password should contain at least one digit.</li><li>Password should contain at least one special character.</li><li>Password must have a minimum length of 8 characters.</li></ul>',
          html: true,
        });
      } else {
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    const body: any = {
      username: this.userName,
      email: this.emailId,
      password: this.password,
    };
    this.authService.register(body).subscribe({
      next: (res: any) => {
        if (res && res.body&& res.body.success) {
          this.router.navigateByUrl('/otp-verification/'+this.emailId)
          // this.submitted = false;
          // this.openSnackBar('User created successfully', false);
          // setTimeout(() => {
          //   this.redirect();
          // }, 1000);
        } else {
          this.openSnackBar('Something went wrong', true);
          this.submitted = false;
        }
      },
      error: (error: any) => {
        this.submitted = false;
        if(error&&error.error&&error.error.success==false)
        this.openSnackBar(error.error.message, true);
      },
    });
  }

  redirect(): void {
    this.router.navigateByUrl('sign-in');
  }
  public openSnackBar(message: string, hasError: boolean): any {
    const config: any = new MatSnackBarConfig();
    config.panelClass = hasError ? ['error-red'] : ['success-green'];
    config.duration = 5000;
    config.verticalPosition = 'bottom';
    this.snackbar.open(message, undefined, config);
  }
}
