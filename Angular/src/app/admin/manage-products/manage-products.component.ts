import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { DataService } from 'src/app/core/common-services/data.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss'],
})
export class ManageProductsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedProductColumns = [
    'imageURL',
    'productName',
    'price',
    'description',
    'actions',
  ];
  categories: any = [];
  productList: any = [];
  displayedColumns = ['categoryName', 'description', 'actions'];
  dataSource = new MatTableDataSource<Element>(this.categories);
  productDataSource = new MatTableDataSource<Element>(this.productList);
  submitCategory: boolean = false;
  submitProduct: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private dataService: DataService
  ) {}
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.productDataSource.paginator = this.paginator;
    this.productDataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getCategory();
    this.getProducts();
  }

  getCategory(): void {
    this.dataService.getCategories().subscribe((res: any) => {
      if (res && res.status == 200) {
        if (res.body && res.body.data && res.body.success) {
          this.categories = res.body.data;
          this.dataSource.data = this.categories;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    });
  }

  getProducts(): void {
    this.dataService.getProducts().subscribe((res: any) => {
      if (res && res.status == 200) {
        if (res.body && res.body.data && res.body.success) {
          this.productList = res.body.data;
          this.productDataSource.data = this.productList;
          this.productDataSource.paginator = this.paginator;
          this.productDataSource.sort = this.sort;
          // this.dtTrigger.next();
        }
      }
    });
  }

  editProduct(product: any): void {
    product.isEdit = true;
    let dialogRef = this.dialog.open(AddProductComponent, {
      minWidth: '40vw',
      hasBackdrop: false,
      position: { top: '100px' },
      data: { categories: this.categories, product: product },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.getProducts();
      product.isEdit = false;
    });
  }
  addProduct(): void {
    this.submitProduct = true;
    let dialogRef = this.dialog.open(AddProductComponent, {
      minWidth: '50vw',
      hasBackdrop: false,
      // position: { top: '100px' },
      data: { categories: this.categories },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.getProducts();
      this.submitProduct = false;
    });
  }
  addCategory(): void {
    this.submitCategory = true;
    let dialogRef = this.dialog.open(AddCategoryComponent, {
      minWidth: '40vw',
      hasBackdrop: false,
      position: { top: '100px' },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.getCategory();
      this.submitCategory = false;
    });
  }
  deleteCategory(category: any): void {
    category.IsDeleteCategory = true;
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      minWidth: '30vw',
      position: { top: '100px' },
      hasBackdrop: true,
      data: category,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === 'Yes') {
        this.dataService.deleteCategory(category.id).subscribe(
          (res: any) => {
            if (res && res.status == 200) {
              if (res.body && res.body.success) {
                this.openSnackBar('Category deleted successfully', false);
              }
              category.IsDeleteCategory = false;
              this.getCategory();
            } else {
              this.openSnackBar('Something went wrong', true);
              category.IsDeleteCategory = false;
            }
          },
          (err) => {
            if (err && err.error && err.error.message) {
              this.openSnackBar(err.error.message, true);
            } else {
              this.openSnackBar('Something went wrong', true);
            }
            category.IsDeleteCategory = false;
          }
        );
      } else {
        category.IsDeleteCategory = false;
      }
    });
  }
  deleteProduct(product: any): void {
    product.isDelete = true;
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      minWidth: '30vw',
      // position: { top: '100px' },
      // hasBackdrop: true,
      data: product,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === 'Yes') {
        this.dataService.deleteProduct(product.id).subscribe(
          (res: any) => {
            if (res && res.status == 200) {
              if (res.body && res.body.success) {
                this.openSnackBar('Product deleted successfully', false);
              }
              product.IsDelete = false;
              this.getProducts();
            } else {
              this.openSnackBar('Something went wrong', true);
              product.IsDelete = false;
            }
          },
          (err) => {
            if (err && err.error && err.error.message) {
              this.openSnackBar(err.error.message, true);
            } else {
              this.openSnackBar('Something went wrong', true);
            }
            product.IsDelete = false;
          }
        );
      }
    });
  }
  editCategory(category: any): void {
    category.IsEditCategory = true;
    let dialogRef = this.dialog.open(AddCategoryComponent, {
      minWidth: '40vw',
      hasBackdrop: false,
      position: { top: '100px' },
      data: category,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.getCategory();
      category.IsEditCategory = false;
    });
  }
  public openSnackBar(message: string, hasError: boolean): any {
    const config: any = new MatSnackBarConfig();
    config.panelClass = hasError ? ['error-red'] : ['success-green'];
    config.duration = 5000;
    config.verticalPosition = 'bottom';
    this.snackBar.open(message, undefined, config);
  }
  applyFilter(event: any) {
    let filterValue: any = event.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  filterProducts(event: any) {
    let filterValue: any = event.target.value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.productDataSource.filter = filterValue;
  }
  ngOnDestroy(): void {}
}
