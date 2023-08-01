import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/core/common-services/data.service';

@Component({
  selector: 'app-my-favourite',
  templateUrl: './my-favourite.component.html',
  styleUrls: ['./my-favourite.component.scss'],
})
export class MyFavouriteComponent implements OnInit {
  constructor(private data: DataService, private snackBar: MatSnackBar) {}
  favourites: any = [];
  displayedColumns = ['imageUrl','productName','price', 'actions'];
  dataSource = new MatTableDataSource<Element>(this.favourites);
  ngOnInit(): void {
    this.getMyFavourites();
  }

  getMyFavourites(): void {
    this.data.getFavourites().subscribe((res: any) => {
      if (res && res.body && res.body.data) {
        this.favourites = res.body.data;
        this.dataSource.data = this.favourites;
        console.log(this.favourites);
      }
    });
  }
  remove(item: any): void {
    this.data.removeFavourite({ id: item.id }).subscribe({
      next: (res) => {
        if (res && res.status == 200 && res.body.success) {
          this.openSnackBar(res.body.message, false);
          this.getMyFavourites();
        } else {
          this.openSnackBar('Something went wrong', true);
        }
      },
      error: (err) => {
        if (err && err.error && err.error.message) {
          this.openSnackBar(err.error.message, true);
        } else {
          this.openSnackBar('Something went wrong', true);
        }
      },
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
