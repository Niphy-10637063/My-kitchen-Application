import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {
  transform(productList: any, searchText: string): any[] {
    if (!productList || !searchText) {
      return productList;
    }

    return productList.filter((product: any) =>
      product.productName.toLowerCase().includes(searchText.toLowerCase())
    );
  }

}

