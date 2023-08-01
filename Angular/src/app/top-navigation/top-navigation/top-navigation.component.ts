import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss'],
})
export class TopNavigationComponent implements OnInit {
  updateTimer: any;
  userName: string = '';
  updateTimerSubscription: Subscription | undefined;
  cartCount: number = 0;
  constructor(private router: Router, public authService: AuthService) {}
  ngOnInit(): void {
    const userInfo = this.authService.getUserFromStorage();
    if (userInfo) {
      this.userName = userInfo.userName;
    }
    this.updateTimer = timer(100, 100);
    this.updateTimerSubscription = this.updateTimer.subscribe(() => {
      let cartItems: any = localStorage.getItem('CART_ITEMS');
      this.cartCount = 0;
      if (cartItems !== null) {
        cartItems = JSON.parse(cartItems);
        const cartItem = cartItems.find(
          (x: any) => x.userId == userInfo.userId
        );
        if (cartItem) {
          cartItem.productList.forEach((prod: any) => {
            this.cartCount += prod.quantity;
          });
        }
      } else {
        this.cartCount = 0;
      }
    });
  }
  viewCart(): void {
    this.router.navigateByUrl('my-kitchen/cart');
  }
  logout(): void {
    this.authService.destroySession();
    this.router.navigateByUrl('sign-in');
  }
}
