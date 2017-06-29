import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Product } from '../product';
import { environment } from '../../environments/environment'
import { ProductLikes } from '../product-likes'

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent {

    @Input() data: Product;
    @Output() onProductSelected = new EventEmitter<String>();

    imgUrl: String;

    ngOnInit(): void {
        //Me fijo en el localStorage si el producto fue likeado por el usuario y seteo la imágen correspondiente para el botón
        this.imgUrl = environment.likeButtonUrl;

        if (typeof localStorage !== 'undefined') {

            let likes = localStorage.getItem("likes");

            if (likes) {

                //Parseo el string del localStorage a un Objeto de tipo ProductLikes
                let likesObjs: Array<ProductLikes> = JSON.parse(likes);

                //Busco el producto en el que estoy y me fijo si está likeado.
                likesObjs.forEach(likeObj => {
                    if (likeObj.productId === this.data.id) {
                        if (likeObj.isLiked) {
                            this.imgUrl = environment.likeButtonLikedUrl;
                        }
                    }
                });
            }

        } else {
            alert("Error: Tu navegador no soporta local storage para guardar los likes");
        }
    }

    productSelected(productId: String): void {
        this.onProductSelected.emit(productId);
    }

}
