import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  productList: any = [];
  userId: any;
  cartCount: number = 0;
  total: number = 0;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const userinfo = this.authService.getUserFromStorage();
    if (userinfo) {
      this.userId = userinfo.userId;
      this.getCartItems();
    }
  }
  getCartItems(): void {
    this.total = 0;
    this.cartCount = 0;
    let cartItems: any = localStorage.getItem('CART_ITEMS');
    this.cartCount = 0;
    this.productList = [];
    if (cartItems !== null) {
      cartItems = JSON.parse(cartItems);
      const cartItem = cartItems.find((x: any) => x.userId == this.userId);
      this.productList = cartItem.productList;
      cartItem.productList.forEach((prod: any) => {
        this.cartCount += prod.quantity;
        this.total += prod.quantity * prod.price;
      });
    } else {
      this.cartCount = 0;
      this.total = 0;
    }
  }

  addItem(item: any): void {
    item.quantity += 1;
    let cartItems: any = localStorage.getItem('CART_ITEMS');
    if (cartItems !== null && cartItems !== '[]') {
      cartItems = JSON.parse(cartItems);
      const cartItem = cartItems.find((x: any) => x.userId == this.userId);
      if (cartItem) {
        const product = cartItem.productList.find((x: any) => x.id == item.id);
        product.quantity += 1;
      }
    }
    localStorage.setItem('CART_ITEMS', JSON.stringify(cartItems));
    this.getCartItems();
  }
  removeItem(item: any): void {
    item.quantity -= 1;
    let cartItems: any = localStorage.getItem('CART_ITEMS');
    if (cartItems !== null && cartItems !== '[]') {
      cartItems = JSON.parse(cartItems);
      const cartItem = cartItems.find((x: any) => x.userId == this.userId);
      const index: any = cartItem.productList.findIndex(
        (x: any) => x.id == item.id
      );
      if (item.quantity == 0) {
        if (index !== -1) {
          cartItem.productList.splice(index, 1);
          this.productList = cartItem.productList;
        }
      } else {
        cartItem.productList[index] = item;
      }
    }
    localStorage.setItem('CART_ITEMS', JSON.stringify(cartItems));
    this.getCartItems();
  }

  remove(item: any): void {
    if (item) {
      let cartItems: any = localStorage.getItem('CART_ITEMS');
      if (cartItems !== null && cartItems !== '[]') {
        cartItems = JSON.parse(cartItems);
        const cartItem: any = cartItems.find(
          (x: any) => x.userId == this.userId
        );
        const index: any = cartItem.productList.findIndex(
          (x: any) => x.id == item.id
        );
        if (index !== -1) {
          cartItem.productList.splice(index, 1);
        }
        localStorage.setItem('CART_ITEMS', JSON.stringify(cartItems));
        this.getCartItems();
      }
    }
  }
}
