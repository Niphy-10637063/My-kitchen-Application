import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DataService } from 'src/app/core/common-services/data.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddCategoryComponent>
  ) {}
  category: string = '';
  submitted: boolean = false;
  description: string = '';
  categoryID: number = 0;
  ngOnInit(): void {
    if (this.data) {
      this.category = this.data.categoryName;
      this.description = this.data.description;
      this.categoryID = this.data.id;
    } else {
      this.category = '';
      this.categoryID = 0;
      this.description = '';
    }
  }
  save(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    this.submitted = true;
    const body: any = {
      description: this.description,
      categoryName: this.category,
    };
    if (this.categoryID == 0 || !this.categoryID) {
      (body['id'] = this.categoryID),
        this.dataService.saveCategory(body).subscribe({
          next: (res) => {
            if (res && res.status == 201 && res.body.success) {
              this.submitted = false;
              this.dialogRef.close();
              this.openSnackBar('Category added successfully', false);
            } else {
              this.openSnackBar('Something went wrong', true);
              this.submitted = false;
            }
          },
          error: (err) => {
            if (err && err.error && err.error.message) {
              this.openSnackBar(err.error.message, true);
            }else {
              this.openSnackBar('Something went wrong', true);
            }
            this.submitted = false;
          },
        });
    } else {
      this.dataService.updateCategory(body, this.categoryID).subscribe({
        next: (res) => {
          if (res && res.status == 200) {
            this.submitted = false;
            this.dialogRef.close();
            this.openSnackBar('Category updated successfully', false);
          } else {
            this.openSnackBar('Something went wrong', true);
            this.submitted = false;
          }
        },
        error: (err) => {
          if (err && err.error && err.error.message) {
            this.openSnackBar(err.error.message, true);
          } else {
            this.openSnackBar('Something went wrong', true);
          }
          this.submitted = false;
        },
      });
    }
  }
  public openSnackBar(message: string, hasError: boolean): any {
    const config: any = new MatSnackBarConfig();
    config.panelClass = hasError ? ['error-red'] : ['success-green'];
    config.duration = 5000;
    config.verticalPosition = 'bottom';
    this.snackBar.open(message, undefined, config);
  }
}
