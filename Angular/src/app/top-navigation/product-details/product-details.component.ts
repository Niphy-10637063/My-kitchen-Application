import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { DataService } from 'src/app/core/common-services/data.service';
import { ReviewComponent } from '../review/review.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  userId: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private auth: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.activatedRoute.paramMap.subscribe((obs) => {
      const productId: any = obs.get('id');
      if (+productId > 0) {
        this.getProductById(+productId);
      }
    });
  }
  ngOnInit(): void {
    const user = this.auth.getUserFromStorage();
    if (user !== null && user !== undefined) {
      this.userId = user.userId;
    }
  }

  getProductById(productId: number): void {
    this.dataService.getProductById(productId).subscribe((res: any) => {
      if (res && res.body) {
        this.product = res.body.data;
      }
    });
  }

  addToCart(item: any): void {
    let cartItems: any = localStorage.getItem('CART_ITEMS');
    if (cartItems !== null && cartItems !== '[]') {
      cartItems = JSON.parse(cartItems);
      const cartItem: any = cartItems.find((x: any) => x.userId == this.userId);
      if (cartItem) {
        const product: any = cartItem.productList.find(
          (x: any) => x.id == item.id
        );
        if (product) {
          product.quantity += 1;
        } else {
          item['quantity'] = 1;
          cartItem.productList.push(item);
        }
      } else {
        item['quantity'] = 1;
        const cartItem = { userId: this.userId, productList: [item] };
        cartItems.push(cartItem);
      }
      localStorage.setItem('CART_ITEMS', JSON.stringify(cartItems));
    } else {
      const cartItems: any = [];
      item['quantity'] = 1;
      const cartItem = { userId: this.userId, productList: [item] };
      cartItems.push(cartItem);
      localStorage.setItem('CART_ITEMS', JSON.stringify(cartItems));
    }
    this.openSnackBar('Item added to cart successfully', false);
  }

  public openSnackBar(message: string, hasError: boolean): any {
    const config: any = new MatSnackBarConfig();
    config.panelClass = hasError ? ['error-red'] : ['success-green'];
    config.duration = 5000;
    config.verticalPosition = 'bottom';
    this.snackBar.open(message, undefined, config);
  }
  addToFavourite(product: any): void {
    this.dataService
      .addFavourites({ productId: +product.id })
      .subscribe((res: any) => {
        if (res && res.status == 200) {
          if (res.body && res.body.success) {
            this.openSnackBar(res.body.message, false);
            this.getProductById(+product.id);
          }
        }
      });
  }
  addReview(): void {
    let dialogRef = this.dialog.open(ReviewComponent, {
      minWidth: '40vw',
      hasBackdrop: false,
      position: { top: '100px' },
      data: { 'productId': this.product.id },
    });
    dialogRef.afterClosed().subscribe((res:any)=>{
      this.getProductById(this.product.id)
    })
  }
}
