import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { DataService } from 'src/app/core/common-services/data.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  public userId: any;
  public total: any = { count: 0, price: 0 };
  productList: any = [];
  public address: string = '';
  public contactNo: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  submitted: boolean = false;
  constructor(
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private dataService: DataService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const user = this.auth.getUserFromStorage();
    if (user !== null && user !== undefined) {
      this.email = user.email;
      this.userId = user.userId;
      let cartItems: any = localStorage.getItem('CART_ITEMS');
      if (cartItems !== null && cartItems !== '[]') {
        cartItems = JSON.parse(cartItems);
        const cartItem: any = cartItems.find(
          (x: any) => x.userId == this.userId
        );
        if (cartItem) {
          this.productList = cartItem.productList;
          this.getTotalAndCount();
        }
      }
    }
  }

  getTotalAndCount(): void {
    this.total = { count: 0, price: 0 };
    this.productList.forEach((product: any) => {
      this.total.count += product.quantity;
      this.total.price += product.quantity * product.price;
    });
  }

  addOrder(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    this.submitted = true;
    const order: any = {
      firstName: this.firstName,
      lastName: this.lastName,
      contactNumber: this.contactNo,
      shippingAddress: this.address,
      total: this.total.price,
      orderDetails: [],
    };
    this.productList.forEach((product: any) => {
      if (product) {
        order.orderDetails.push({
          quantity: product.quantity,
          price: product.price,
          subtotal: product.quantity * product.price,
          productId: product.id,
          productName: product.productName,
        });
      }
    });
    this.dataService.saveOrder(order).subscribe({
      next: (res) => {
        if (res && res.status == 201 && res.body.success) {
          this.openSnackBar('Your order placed successfully', false);
          let cartItems: any = localStorage.getItem('CART_ITEMS');
          if (cartItems !== null && cartItems !== '[]') {
            cartItems = JSON.parse(cartItems);
            const index: number = cartItems.findIndex(
              (x: any) => x.userId == this.userId
            );
            if (index !== -1) {
              cartItems.splice(index, 1);
              localStorage.setItem('CART_ITEMS', JSON.stringify(cartItems));
            }
          }
          this.router.navigateByUrl('/my-kitchen/order-success/'+this.email);
        } else {
          this.openSnackBar('Something went wrong', true);
        }
        this.submitted = false;
      },
      error: (err) => {
        this.submitted = false;
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
}
