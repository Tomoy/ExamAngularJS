import * as moment from 'moment';
import 'moment/locale/es';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'publicationDate'
})
export class PublicationDatePipe implements PipeTransform {

    //Este método obligatorio de la interfaz PipeTransform, siempre recibe al menos un parámetro: el dato a transformar
    transform(timeStampDate: string): string {
        return moment(timeStampDate).fromNow();
    }

}