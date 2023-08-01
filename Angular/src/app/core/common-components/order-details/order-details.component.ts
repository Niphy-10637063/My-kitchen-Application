import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../common-services/data.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit{
  orderDetails: any = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar:MatSnackBar,
  private dataService:DataService) {}
  ngOnInit(): void {
    this.getOrderDetails();
  }
  private getOrderDetails():void{
    this.dataService.getOrderDetailsByOrderId(this.data.orderId).subscribe({
      next: (res:any) => {
        if (res && res.status == 200 && res.body.success) {
          this.orderDetails = res.body.data;
        } else {
 
        }
      },
      error: (err) => {
        if (err && err.error && err.error.message) {
          this.openSnackBar(err.error.message, true);
        } else {
        }
      },
    })
  }
  public openSnackBar(message: string, hasError: boolean): any {
    const config: any = new MatSnackBarConfig();
    config.panelClass = hasError ? ['error-red'] : ['success-green'];
    config.duration = 5000;
    config.verticalPosition = 'bottom';
    this.snackBar.open(message, undefined, config);
  }
}
