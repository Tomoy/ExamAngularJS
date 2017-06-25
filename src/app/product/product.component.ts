import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Product } from '../product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  @Input() data: Product;
  @Output() onProductSelected = new EventEmitter<String>();

  productSelected(productId:String): void {
    this.onProductSelected.emit(productId);
  }
  
}
