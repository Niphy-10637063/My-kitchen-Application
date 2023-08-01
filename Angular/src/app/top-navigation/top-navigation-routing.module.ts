import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ChildAuthGuard } from '../core/authentication/childAuth.guard';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MyFavouriteComponent } from './my-favourite/my-favourite.component';

const routes: Routes = [
  {
    path: '',
    component: TopNavigationComponent,
    children: [
      {
        path: '',
        component: ProductListComponent,
      },
      {
        path: 'food/:id',
        component: ProductDetailsComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
      },
      {
        path: 'order-success/:email',
        component: OrderSuccessComponent,
      },
      {
        path:'my-orders',
        component:MyOrdersComponent
      },
      {
        path:'my-favourites',
        component:MyFavouriteComponent
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('../admin/admin.module').then((m) => m.AdminModule),
        canActivateChild: [ChildAuthGuard],
      },
      // {
      //   path:'',
      //   pathMatch:"full",
      //   redirectTo:'product-list',
      // }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopNavigationRoutingModule {}
