import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/core/common-services/data.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  displayedColumns: string[] = ['tagName', 'actions'];
  tagName: string = '';
  productName: string = '';
  productID: number = 0;
  rate: string = '';
  imageSrc: string = '';
  imageUrl: string = '';
  time: string = '';
  file: string = '';
  description: string = '';
  category: string = '';
  submitted: boolean = false;
  tagList: any = [];
  dataSource = new MatTableDataSource<Element>(this.tagList);
  ngOnInit(): void {
    if (this.data.product) {
      this.productName = this.data.product.productName;
      this.imageUrl = this.data.product.imageUrl;
      this.rate = this.data.product.price;
      this.productID = this.data.product.id;
      this.category = this.data.product.categoryId;
      this.description = this.data.product.description;
      this.time = this.data.product.time;
      this.tagList = this.data.product.tags;
      this.dataSource.data = this.tagList;
    } else {
      this.productName = '';
      this.productID = 0;
      this.rate = '';
      this.imageUrl = '';
      this.category = '';
      this.description = '';
    }
  }

  close(form: NgForm): void {
    form.resetForm();
  }

  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageSrc = reader.result as string;
        console.log(this.imageSrc);
      };
    }
  }

  addProduct(pdtForm: NgForm): void {
    if (!pdtForm.valid) {
      return;
    }
    this.submitted = true;
    const body: any = {
      productName: this.productName,
      description: this.description,
      price: this.rate,
      imageUrl: this.imageUrl,
      time: this.time,
      categoryId: this.category,
      tags: this.tagList,
    };
    if (this.productID == 0 || !this.productID) {
      body['id'] = this.productID;
      this.dataService.saveProduct(body).subscribe({
        next: (res) => {
          if (res && res.status == 201 && res.body.success) {
            this.submitted = false;
            this.dialogRef.close();
            this.openSnackBar('Product added successfully', false);
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
    } else {
      this.dataService.updateProduct(body, this.productID).subscribe({
        next: (res) => {
          if (res && res.status == 200) {
            this.submitted = false;
            this.dialogRef.close();
            this.openSnackBar('Product updated successfully', false);
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
  deleteTag(index: number): void {
    if (index !== -1) {
      this.tagList.splice(index, 1);
      this.dataSource.data = this.tagList;
    }
  }

  addTags(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    this.tagList.push({ tagName: this.tagName });
    form.resetForm();
    this.dataSource.data = this.tagList;
  }
  public openSnackBar(message: string, hasError: boolean): any {
    const config: any = new MatSnackBarConfig();
    config.panelClass = hasError ? ['error-red'] : ['success-green'];
    config.duration = 5000;
    config.verticalPosition = 'bottom';
    this.snackBar.open(message, undefined, config);
  }
}
