import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';

const routes: Routes = [
  {
    path:'manage-orders',
    component:ManageOrderComponent,
  },
  {
    path:'manage-products',
    component:ManageProductsComponent,
  },
  {
    path: '',
    pathMatch:"full",
    redirectTo:'manage-orders',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
