import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ConfirmationService } from 'primeng/primeng';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { environment } from '../../environments/environment'
import { ProductLikes } from '../product-likes'

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnDestroy, OnInit {

    product: Product;
    imgUrl: String;
    isProductLiked: Boolean;
    private _productSubscription: Subscription;

    constructor(
        private _productService: ProductService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this._route.data.forEach((data: { product: Product }) => this.product = data.product);
        window.scrollTo(0, 0);

        //Me fijo en el localStorage si el producto fue likeado por el usuario y seteo la imágen correspondiente para el botón
        this.imgUrl = environment.likeButtonUrl;
        this.isProductLiked = false;

        if (typeof localStorage !== 'undefined') {

            let likes = localStorage.getItem("likes");

            if (likes) {

                //Parseo el string del localStorage a un Objeto de tipo ProductLikes
                let likesObjs:Array<ProductLikes> = JSON.parse(likes);

                //Busco el producto en el que estoy y me fijo si está likeado.
                likesObjs.forEach(likeObj => {
                    if (likeObj.productId === this.product.id) {
                        if (likeObj.isLiked) {
                            this.isProductLiked = true;
                            this.imgUrl = environment.likeButtonLikedUrl;
                        }
                    }
                });
            }

        } else {
            alert("Error: Tu navegador no soporta local storage para guardar los likes");
        }
    }

    ngOnDestroy(): void {
        if (this._productSubscription !== undefined) {
            this._productSubscription.unsubscribe();
        }
    }

    private _buyProduct(): void {
        this._productSubscription = this._productService
            .buyProduct(this.product.id)
            .subscribe(() => this._showPurchaseConfirmation())
    }

    private _showPurchaseConfirmation(): void {
        this._confirmationService.confirm({
            rejectVisible: false,
            message: 'Producto comprado. ¡Enhorabuena!',
            accept: () => this._router.navigate(['/product'])
        });
    }

    showPurchaseWarning(): void {
        this._confirmationService.confirm({
            message: `Vas a comprar ${this.product.name}. ¿Estás seguro?`,
            accept: () => this._buyProduct()
        });
    }

    goBack(): void {
        window.history.back();
    }

    likeProduct(): void {

        let likes = localStorage.getItem(environment.likesLocalStorage);
        let likesObjs:Array<ProductLikes>;
        
        //Si ya fue agregado anteriormente algún producto, tomo el array y lo guardo en la prop likesObjs, sino creo un array vacio
        if (likes) {
            likesObjs = JSON.parse(likes);
        } else {
            likesObjs = new Array();
        }
        
        //Chequeo si el producto ya fue agregado al array de productos de likes para no agregarlo dos veces
        let like: ProductLikes = {};
        let productIsOnStorage:boolean = false;

        likesObjs.forEach(product => {
            if (product.productId === this.product.id) {
                like = product;
                productIsOnStorage = true;
            }
        });

        like.productId = this.product.id;

        if (this.isProductLiked) {
            like.isLiked = false;
            this.imgUrl = environment.likeButtonUrl;
            this.isProductLiked = false;
        } else {
            like.isLiked = true;
            this.imgUrl = environment.likeButtonLikedUrl;
            this.isProductLiked = true;
        }

        //Si el producto todavía no fue agregado al storage, hago un push del objeto al array
        if (!productIsOnStorage) {
            likesObjs.push(like);
        }

        //Convierto a string el objeto ProductLikes y lo guardo en el localStorage
        let likesObjectToString = JSON.stringify(likesObjs);
        localStorage.setItem(environment.likesLocalStorage, likesObjectToString);
    }

}
