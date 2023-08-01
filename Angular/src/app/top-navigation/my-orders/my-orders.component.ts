import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/core/common-services/data.service';
import { OrderCancelConfirmationComponent } from '../order-cancel-confirmation/order-cancel-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { OrderDetailsComponent } from 'src/app/core/common-components/order-details/order-details.component';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit, AfterViewInit {
  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  displayedColumns = [
    'id',
    'firstName',
    'contactNumber',
    'shippingAddress',
    'orderDate',
    'total',
    'status',
    'updatedDate',
    'action',
  ];

  orders: any = [];
  dataSource = new MatTableDataSource<any>(this.orders);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.getOrders();
  }
  getOrders(): void {
    this.dataService.getOrderByUser().subscribe((res: any) => {
      if (res && res.status == 200) {
        if (res.body && res.body.data && res.body.success) {
          this.dataSource.data = res.body.data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    });
  }
  applyFilter(event: any) {
    let filterValue: any = event.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  cancelOrder(order: any): void {
    let dialogRef = this.dialog.open(OrderCancelConfirmationComponent, {
      minWidth: '30vw',
      position: { top: '100px' },
      hasBackdrop: true,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === 'Yes') {
        this.dataService.cancelOrder(order.id).subscribe((res: any) => {
          if (res && res.status == 200) {
            if (res.body && res.body.success) {
              this.openSnackBar('Order cancelled successfully', false);
              this.getOrders();
            }
          }
        });
      }
    });
  }
  public openSnackBar(message: string, hasError: boolean): any {
    const config: any = new MatSnackBarConfig();
    config.panelClass = hasError ? ['error-red'] : ['success-green'];
    config.duration = 5000;
    config.verticalPosition = 'bottom';
    this.snackBar.open(message, undefined, config);
  }

  getDate(date: any) {
    if (date !== null) {
      let timestamp = new Date(date).getTime();
      timestamp = timestamp - 3600000;
      return this.datePipe.transform(new Date(timestamp), 'dd-MM-yyyy hh:mm a');
    }
    return 'NULL';
  }

  viewDetails(order:any):void{
    this.dialog.open(OrderDetailsComponent, {
      minWidth: '50vw',
      hasBackdrop: false,
      // position: { top: '100px' },
      data: { orderId: order.id },
    });
  }
}
