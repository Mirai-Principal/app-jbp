import { Injectable } from '@angular/core';
import {ItemCodeMsg } from '../msg/common.msg'

@Injectable()
export class dateUtils {
    static getMesesArray(): ItemCodeMsg[] {
        return [
            { Code: '01', Name: 'Enero'},
            { Code: '02', Name: 'Febrero'},
            { Code: '03', Name: 'Marzo'},
            { Code: '04', Name: 'Abril'},
            { Code: '05', Name: 'Mayo'},
            { Code: '06', Name: 'Junio'},
            { Code: '07', Name: 'Julio'},
            { Code: '08', Name: 'Agosto'},
            { Code: '09', Name: 'Septiembre'},
            { Code: '10', Name: 'Octubre'},
            { Code: '11', Name: 'Noviembre'},
            { Code: '12', Name: 'Diciembre'}
        ];
    }
}