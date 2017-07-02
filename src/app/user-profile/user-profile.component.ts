import { Component, Input, OnChanges, OnDestroy, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription, Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { User } from '../user';
import { Product } from '../product';
import { UserService } from '../user.service';
import { ProductService } from '../product.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnChanges, OnDestroy {

    @Input() userId: number;

    user: User;
    userProducts: Product[];
    @Output() onProductChange: EventEmitter<string> = new EventEmitter();


    private _userSubscription: Subscription;

    constructor(private _userService: UserService,
                private _productService: ProductService,
                private _router: Router ) { }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['userId'] && changes['userId']['currentValue']) {
            this._userSubscription = this._userService
                .getUser(this.userId)
                .subscribe(data => this.user = data);

            this._productService.getProductsForUser(this.userId.toString())
                .subscribe(result => this.userProducts = result);
        }
    }

    ngOnDestroy(): void {
        if (this._userSubscription) {
            this._userSubscription.unsubscribe();
        }
    }

    getImageSrc(): string {
        return this.user ? this.user.avatar : '';
    }

    relatedProductClicked(productId:string) {
        this._router.navigate(['/products/' + productId]);
        //Le aviso al padre, para poder actualizar el estado del botón de like
        this.onProductChange.emit(productId);
    }

}
