import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/common-services/data.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private dataService: DataService
  ) {}
  productList: any = [1, 2, 3, 4, 4];
  categories: any = [];
  totalProductCount: number = 0;
  selectedCategoryId: any = 0;
  searchText: string = '';
  ngOnInit(): void {
    this.getCategory();
    this.getProducts();
  }
  viewDetails(product: any): void {
    this.router.navigateByUrl('my-kitchen/food/' + product.id);
  }
  getProducts(categoryId: number = 0): void {
    this.dataService.getProducts(categoryId).subscribe((res: any) => {
      if (res && res.status == 200) {
        if (res.body && res.body.data && res.body.success) {
          this.productList = res.body.data;
          // this.dtTrigger.next();
        }
      }
    });
  }
  getCategory(): void {
    this.dataService.getCategoriesWithPdtCount().subscribe((res: any) => {
      if (res && res.status == 200) {
        if (res.body && res.body.data && res.body.success) {
          this.categories = res.body.data.category_list;
          this.totalProductCount = res.body.data.totalCount;
        }
      }
    });
  }
  navigate(category: any): void {
    if (category) {
      this.selectedCategoryId = category.id;
    } else {
      this.selectedCategoryId = 0;
    }
    this.getProducts(this.selectedCategoryId);
  }
  clear():void{
    this.searchText='';
  }
  addToFavourite(event: any, product: any): void {
    event.stopPropagation();
    this.dataService.addFavourites({productId:product.id}).subscribe((res: any) => {
      if (res && res.status == 200) {
        if (res.body && res.body.success) {
          this.openSnackBar(res.body.message, false);
          this.getProducts(this.selectedCategoryId)
        }
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
}
