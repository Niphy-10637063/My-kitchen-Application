import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { HttpsRequestResponseInterceptor } from './core/authentication/http.interceptor';
import { DataService } from './core/common-services/data.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChildAuthGuard } from './core/authentication/childAuth.guard';
import { ProductFilterPipe } from './core/pipes/product-filter.pipe';
import { OrderDetailsComponent } from './core/common-components/order-details/order-details.component';
const appInitializationFactory: any = (dataService: DataService) => {
  return () => {
    dataService.initialize();
  };
};
@NgModule({
  declarations: [AppComponent, OrderDetailsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSnackBarModule,
    HttpClientModule,
    MatDialogModule,
    CommonModule,

  ],
  providers: [
    HttpClient,
    ChildAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsRequestResponseInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializationFactory,
      multi: true,
      deps: [DataService],
    },
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],

  bootstrap: [AppComponent],
})
export class AppModule {}
