import { Inject, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BackendUri } from './app-settings';
import { Product } from './product';
import { ProductFilter } from './product-filter';

@Injectable()
export class ProductService {

    constructor(
        private _http: Http,
        @Inject(BackendUri) private _backendUri) { }

    getProducts(filter: ProductFilter = undefined): Observable<Product[]> {
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Yellow Path                                                      |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pide al servidor que te retorne los productos filtrados por      |
        | estado.                                                          |
        |                                                                  |
        | En la documentación de 'JSON Server' tienes detallado cómo       |
        | filtrar datos en tus peticiones, pero te ayudo igualmente. La    |
        | querystring debe tener estos parámetros:                         |
        |                                                                  |
        |   - Búsqueda por estado:                                         |
        |       state=x (siendo x el estado)                               |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        let filtersToAdd: string = '';

        if (filter) {

            if (filter.category) {
                //Para que si el usuario selecciona la primer categoría '-', muestre todos los productos. Solo, si es una categoría de las existentes, 1,2 o 3, filtra.
                if (filter.category !== '0') {
                    filtersToAdd = "&category.id=" + filter.category;
                }
            }

            if (filter.text) {
                filtersToAdd += "&q=" + filter.text;
            }
        }

        return this._http
            .get(`${this._backendUri}/products?_sort=publishedDate&_order=DESC` + filtersToAdd)
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
