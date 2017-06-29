import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Product } from './product';
import { ProductFilter } from './product-filter';
import { ProductService } from './product.service';

@Injectable()
export class SoldProductsResolveService implements Resolve<Product[]> {

  constructor(private _productService: ProductService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Product[]> {

    let filter:ProductFilter = {};

    filter.state = "sold";

    let products: Observable<Product[]> = this._productService.getProducts(filter);

    return products;
  }

}
