import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/common-services/data.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}
  ratings: any = [1, 2, 3, 4, 5];
  reviews: any = [];
  reviewMessage: string = '';
  selectedRating: number = 0;
  onRatingSelection(rating: number): void {
    this.selectedRating = rating;
  }
  reset(): void {
    this.selectedRating = 0;
  }
  addReview(reviewForm: NgForm): void {
    if (!reviewForm.valid) {
      return;
    }
    const body: any = {
      reviewText: this.reviewMessage,
      rating: this.selectedRating,
      productId: this.data.productId,
    };
    this.dataService.addReview(body).subscribe({
      next: (res) => {
        if (res && res.status == 201 && res.body.success) {
          this.openSnackBar('Review added successfully', false);
          reviewForm.resetForm();
          this.reset();
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

  onTabChanged(event: any): void {
    this.reviews = [];
    if (event && event.index) {
      this.dataService.getReviews(this.data.productId).subscribe({
        next: (res) => {
          if (res && res.status == 200 && res.body.success) {
            this.reviews = res.body.data;
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
    console.log(event);
  }
}
