import { Inject, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BackendUri } from './app-settings';
import { Product } from './product';
import { User } from './user';
import { ProductFilter } from './product-filter';

@Injectable()
export class ProductService {

    constructor(
        private _http: Http,
        @Inject(BackendUri) private _backendUri) { }

    getProducts(filter: ProductFilter = undefined): Observable<Product[]> {

        let filtersToAdd: string = '';

        if (filter) {

            filtersToAdd = "order=ASC";

            if (filter.category) {
                //Para que si el usuario selecciona la primer categoría '-', muestre todos los productos. Solo, si es una categoría de las existentes, 1,2 o 3, filtra.
                if (filter.category !== '0') {
                    filtersToAdd = "&category.id=" + filter.category;
                }
            }

            if (filter.text) {
                filtersToAdd += "&q=" + filter.text;
            }

            if (filter.state) {
                filtersToAdd += "&state=" + filter.state;
            }

            if (filter.minPrice) {
                filtersToAdd += "&price_gte=" + filter.minPrice;
            }

            if (filter.maxPrice) {
                filtersToAdd += "&price_lte=" + filter.maxPrice;
            }

            if (filter.order) {

                let orderFilter = "publishedDate";

                if (filter.order === "text") {
                    orderFilter = "name";
                } else if (filter.order === "price") {
                    orderFilter = "price";
                }

                filtersToAdd += "&_sort=" + orderFilter + "&_order=ASC";
            }
        }

        return this._http
            .get(`${this._backendUri}/products?` + filtersToAdd)
            .map((data: Response): Product[] => Product.fromJsonToList(data.json()));
    }

    getProductsForUser(userId:string): Observable<Product[]>  {
        
        return this._http
            .get(`${this._backendUri}/products?seller.id=` + userId)
            .map((data: Response): Product[] => Product.fromJsonToList(data.json()));
    }

    getProduct(productId: number): Observable<Product> {
        return this._http
            .get(`${this._backendUri}/products/${productId}`)
            .map((data: Response): Product => Product.fromJson(data.json()));
    }

    buyProduct(productId: number): Observable<Product> {
        const body: any = { 'state': 'sold' };
        return this._http
            .patch(`${this._backendUri}/products/${productId}`, body)
            .map((data: Response): Product => Product.fromJson(data.json()));
    }

    setProductAvailable(productId: number): Observable<Product> {
        const body: any = { 'state': 'selling' };
        return this._http
            .patch(`${this._backendUri}/products/${productId}`, body)
            .map((data: Response): Product => Product.fromJson(data.json()));
    }

}
