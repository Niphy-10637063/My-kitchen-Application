import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TopNavigationRoutingModule } from './top-navigation-routing.module';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FormsModule } from '@angular/forms';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderCancelConfirmationComponent } from './order-cancel-confirmation/order-cancel-confirmation.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import { ProductFilterPipe } from '../core/pipes/product-filter.pipe';
import { ReviewComponent } from './review/review.component';
import { MyFavouriteComponent } from './my-favourite/my-favourite.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    TopNavigationComponent,
    ProductListComponent,
    ProductDetailsComponent,
    CartComponent,
    CheckoutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    OrderCancelConfirmationComponent,
    ProductFilterPipe,
    ReviewComponent,
    MyFavouriteComponent
  ],
  imports: [
    CommonModule,
    TopNavigationRoutingModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule
  ],
  providers:[DatePipe]
})
export class TopNavigationModule {}
