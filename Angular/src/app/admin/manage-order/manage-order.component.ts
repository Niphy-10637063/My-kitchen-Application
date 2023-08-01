import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderDetailsComponent } from 'src/app/core/common-components/order-details/order-details.component';
import { DataService } from 'src/app/core/common-services/data.service';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss'],
})
export class ManageOrderComponent implements OnInit, AfterViewInit {
  constructor(private dataService: DataService, 
    private datePipe:DatePipe,
    private dialog: MatDialog) {}

  displayedColumns = [
    'id',
    'firstName',
    'contactNumber',
    'shippingAddress',
    'orderDate',
    'total',
    'status',
    'updatedDate',
    'action'
  ];
  orderHistory: any = [];
  dataSource = new MatTableDataSource<any>(this.orderHistory);

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
    this.dataService.getOrderHistory().subscribe((res: any) => {
      if (res && res.status == 200) {
        if (res.body) {
          this.orderHistory = res.body.data;
          this.dataSource.data = this.orderHistory;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    });
  }

  applyFilter(event: any): void {
    let filterValue: any = event.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  viewDetails(order: any): void {
    this.dialog.open(OrderDetailsComponent, {
      minWidth: '50vw',
      hasBackdrop: false,
      // position: { top: '100px' },
      data: { orderId: order.id },
    });
  }

  getDate(date: any) {
    if (date !== null) {
      let timestamp = new Date(date).getTime();
      timestamp = timestamp - 3600000;
      return this.datePipe.transform(new Date(timestamp), 'dd-MM-yyyy hh:mm a');
    }
    return 'NULL';
  }
}
